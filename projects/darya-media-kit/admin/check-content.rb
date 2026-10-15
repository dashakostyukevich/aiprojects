# Checks content/content.json against admin/config.yml.
#
# Decap needs three things to line up, and it reports each one as a bare error
# in the editing screen with no clue where it came from:
#
#   1. The file entry must have a `fields` list (not `groups`).
#   2. Every object widget must have its own `fields` list, or it renders as
#      "No field(s) defined for this widget".
#   3. Every item in a list that declares `types:` must carry a `type` matching
#      one of them, or the widget renders "item has no 'type' property". A list
#      with no `types:` holds plain strings and must NOT have a type key.
#
# All three were wrong at least once here, so this runs before every push.
#
# Usage: ruby admin/check-content.rb

require "yaml"
require "json"

ROOT = File.expand_path("..", __dir__)
CONFIG = YAML.load_file(File.join(ROOT, "admin", "config.yml"))
CONTENT = JSON.parse(File.read(File.join(ROOT, "content", "content.json")))
FILE = CONFIG["collections"][0]["files"][0]

problems = []

# --- 1. the file entry has fields -------------------------------------------
unless FILE["fields"].is_a?(Array) && !FILE["fields"].empty?
  problems << "collections[0].files[0] has no 'fields' list"
end
if FILE.key?("groups")
  problems << "collections[0].files[0] uses 'groups', which Decap's schema rejects"
end

# --- object widgets must carry their own fields ------------------------------
walk_objects = lambda do |fields, path|
  (fields || []).each do |f|
    if f["widget"] == "object" && !f["fields"].is_a?(Array)
      problems << "#{(path + [f["name"]]).join(" > ")}: object widget without a 'fields' list"
    end
    walk_objects.call(f["fields"], path + [f["name"]])
    (f["types"] || []).each { |t| walk_objects.call(t["fields"], path + [f["name"], t["name"]]) }
  end
end
walk_objects.call(FILE["fields"], [])

# --- 2 & 3. form keys match the file, and list items carry their type --------
def check_list(list, value, path, problems)
  allowed = (list["types"] || []).map { |t| t["name"] }
  Array(value).each_with_index do |item, i|
    here = "#{path}[#{i}]"
    if allowed.empty?
      problems << "#{here}: plain list holds plain strings but got a type key" if item.is_a?(Hash)
    elsif !item.is_a?(Hash)
      problems << "#{here}: expected an object, got #{item.class}"
    elsif item["type"].nil?
      problems << "#{here}: no 'type' property (allowed: #{allowed.join(', ')})"
    elsif !allowed.include?(item["type"])
      problems << "#{here}: type #{item['type'].inspect} is not one of #{allowed.inspect}"
    end

    # recurse into nested lists declared on the matching type
    type = allowed.include?(item.is_a?(Hash) ? item["type"] : nil) ? item["type"] : allowed.first
    type_def = (list["types"] || []).find { |t| t["name"] == type }
    next unless type_def && item.is_a?(Hash)

    (type_def["fields"] || []).each do |f|
      if f["widget"] == "list"
        check_list(f, item[f["name"]], "#{here}.#{f['name']}", problems)
      elsif f["widget"] == "object" && item[f["name"]].is_a?(Hash)
        walk_leaves(f, item[f["name"]], "#{here}.#{f['name']}", problems)
      end
    end
  end
end

# Object leaves must exist in the content, or the widget renders blank.
def walk_leaves(field, value, path, problems)
  (field["fields"] || []).each do |f|
    if f["widget"] == "object"
      if value[f["name"]].is_a?(Hash)
        walk_leaves(f, value[f["name"]], "#{path}.#{f['name']}", problems)
      elsif value.key?(f["name"])
        problems << "#{path}.#{f['name']}: expected an object"
      end
    elsif f["widget"] == "list"
      check_list(f, value[f["name"]], "#{path}.#{f['name']}", problems)
    end
  end
end

form_keys = FILE["fields"].map { |f| f["name"] }
missing = form_keys - CONTENT.keys
extra = CONTENT.keys - form_keys
problems << "in config but not in content.json: #{missing.join(', ')}" unless missing.empty?
problems << "in content.json but not editable: #{extra.join(', ')}" unless extra.empty?

(FILE["fields"] || []).each do |f|
  if f["widget"] == "list"
    check_list(f, CONTENT[f["name"]], f["name"], problems)
  elsif f["widget"] == "object" && CONTENT[f["name"]].is_a?(Hash)
    walk_leaves(f, CONTENT[f["name"]], f["name"], problems)
  end
end

if problems.empty?
  reels = (CONTENT["WORK"] || []).sum { |g| (g["items"] || []).size }
  puts "PASS: config and content.json agree"
  puts "  #{reels} videos in #{(CONTENT['WORK'] || []).size} categories, " \
       "#{(CONTENT['PHOTOS'] || []).size} photos, #{(CONTENT['BRANDS'] || []).size} brands, " \
       "#{(CONTENT['PACKAGES'] || []).size} packages, #{(CONTENT['ADDONS'] || []).size} add-ons"
else
  puts "PROBLEMS (#{problems.size}):"
  problems.first(25).each { |p| puts "  #{p}" }
  exit 1
end
