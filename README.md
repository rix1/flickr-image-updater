# Flickr photo export tool

This tool will update `created_at` and `modified_at` for files exported from Flickr.

It expects two directories:
- JSON: All JSON files describing the photos. Flickr exports this as "Settings.zip".
- Photos: This is all image and video files exported from Flicker.


```
 .
├──  deno.json
├──  deno.lock
├──  JSON/
├──  main.ts
├──  Photos/
└──  README.md
```


## Running
Using `deno task dev` the script will read all JSON files in `./JSON/`, find the associated image in `./Photos/`. It will then update the creation date and modification based on the `date_taken` field in the JSON file describing that file. 


## Why 

When exporting images from Flickr, the files themselves will have "created" and "modified" dates according to the date they were unzipped from the export.

This makes it cumbersome to import in other apps and services (that don't read the EXIF data).