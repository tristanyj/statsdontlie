library(jsonlite)
library(dplyr)
library(stringr)

generate_types_from_json <- function(json_path, output_dir) {
  data <- fromJSON(json_path)

  # Extract all stat IDs recursively from categories
  get_stat_ids <- function(categories) {
    stat_ids <- c()
    for (i in seq_along(categories$id)) {
      category <- categories[i, ]
      subcategories <- category$subCategories[[1]]

      for (j in seq_along(subcategories$id)) {
        subcategory <- subcategories[j, ]
        stats <- subcategory$stats[[1]]

        stat_ids <- c(stat_ids, stats$id)
      }
    }
    return(unique(stat_ids))
  }

  # Get category IDs
  category_ids <- data$config$categories$id

  # Get subcategory IDs
  subcategory_ids <- unlist(lapply(seq_along(data$config$categories$id), function(i) {
    data$config$categories$subCategories[[i]]$id
  }))

  # Get stat IDs
  stat_ids <- get_stat_ids(data$config$categories)

  # Generate a combined types file
  combined_types <- c(
    "// Generated types from JSON structure",
    "",
    sprintf("export type CategoryKey = %s;",
            paste(sprintf("'%s'", category_ids), collapse = " | ")),
    "",
    sprintf("export type SubCategoryKey = %s;",
            paste(sprintf("'%s'", subcategory_ids), collapse = " | ")),
    "",
    sprintf("export type StatKey = %s;",
            paste(sprintf("'%s'", stat_ids), collapse = " | ")),
    "",
    "// Player type",
    "export interface Player {",
    "  id: string;",
    "  color: string;",
    "  info: {",
    "    name: string;",
    "  };",
    "  stats: {",
    "    [K in StatKey]: number;",
    "  };",
    "}",
    "",
    "// Stat metadata type",
    "export interface StatMeta {",
    "  domain: [number, number];",
    "  scaleType: 'linear';",
    "  formatType: 'number';",
    "}",
    ""
  )

  # Write combined types
  writeLines(combined_types, file.path(output_dir, "dataset.ts"))
  cat(sprintf("Generated combined types file\n"))
}

# Usage:
# Replace with your paths
json_path <- "r/output/dataset.json"
output_dir <- "types"

# Create output directory if it doesn't exist
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Generate the types
generate_types_from_json(json_path, output_dir)
