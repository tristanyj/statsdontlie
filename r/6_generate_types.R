library(jsonlite)
library(dplyr)
library(stringr)

output_dir <- "types"
dataset <- fromJSON("r/output/dataset.json")

extract_stat_ids <- function(categories) {
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

extract_subcategory_ids <- function(categories) {
  return(unlist(lapply(seq_along(categories$id), function(i) {
    categories$subCategories[[i]]$id
  })))
}

extract_player_ids <- function(players) {
  return(players$id)
}

generate_types_from_json <- function(dataset, output_dir) {
  category_ids <- dataset$config$categories$id
  subcategory_ids <- extract_subcategory_ids(dataset$config$categories)
  stat_ids <- extract_stat_ids(dataset$config$categories)
  player_ids <- dataset$players$id

  combined_types <- c(
    "// ----------------------------",
    "// Generated types from JSON structure",
    "// ----------------------------",
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
    sprintf("export type PlayerKey = %s;",
            paste(sprintf("'%s'", player_ids), collapse = " | ")),
    ""
  )

  writeLines(combined_types, file.path(output_dir, "dataset.ts"))
  cat(sprintf("Generated combined types file\n"))
}

generate_types_from_json(dataset, output_dir)
