# Flickr photo export tool

This tool will update `created_at` and `modified_at` for files exported from Flickr.

It expects two directories:
- JSON: All JSON files describing the photos. Flickr exports this as "Settings.zip".
- Photos: This is all image and video files exported from Flicker.


## Running
Using `deno task dev` the script will read all JSON files in `./JSON/`, find the associated image in `./Photos/`. It will then update the creation date and modification based on the `date_taken` field in the JSON file describing that file. 