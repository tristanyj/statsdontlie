library(jsonlite)
library(tidyverse)
library(stringr)

# ----------------------------
# Helper functions
# ----------------------------

create_meta <- function(stat_id, record_value) {
  list(
    domain = c(0, record_value),
    scaleType = "linear",
    formatType = if (str_detect(stat_id, "percentage")) "percent" else "number"
  )
}

# ----------------------------
# Main functions
# ----------------------------

build_config <- function(categories, subcategories, stats) {
  config <- list()

  for (i in seq_len(nrow(categories))) {
    cat_id <- categories[i, "id"][[1]]

    category <- list(
      id = cat_id,
      name = categories[i, "name"][[1]],
      color = categories[i, "color"][[1]],
      subGroups = list()
    )

    cat_subcategories <- subcategories[
      startsWith(subcategories[["id"]], paste0(cat_id, ".")),
    ]

    for (j in seq_len(nrow(cat_subcategories))) {
      sub_id <- cat_subcategories[j, "id"][[1]]

      sub_stats <- stats[
        startsWith(stats[["stat_id"]], paste0(sub_id, ".")),
      ]

      stats_list <- lapply(seq_len(nrow(sub_stats)), function(k) {
        list(
          id = sub_stats[k, "stat_id"][[1]],
          name = sub_stats[k, "stat_name"][[1]],
          meta = create_meta(
            sub_stats[k, "stat_id"][[1]],
            sub_stats[k, "record_value"][[1]]
          ),
          record = list(
            value = sub_stats[k, "record_value"][[1]],
            name = sub_stats[k, "record_holder"][[1]]
          )
        )
      })

      category$subGroups[[length(category$subGroups) + 1]] <- list(
        id = sub_id,
        name = cat_subcategories[j, "name"][[1]],
        color = cat_subcategories[j, "color"][[1]],
        stats = stats_list
      )
    }

    config[[length(config) + 1]] <- category
  }

  return(config)
}

# ----------------------------
# Validation functions
# ----------------------------

validate_subcategories <- function(categories, subcategories) {
  parent_ids <- vapply(
    strsplit(subcategories[["id"]], "\\."),
    function(x) x[1],
    character(1)
  )

  invalid_parents <- setdiff(parent_ids, categories[["id"]])
  if (length(invalid_parents) > 0) {
    stop("Invalid parent categories found: ", paste(invalid_parents, collapse = ", "))
  }
}

validate_stats <- function(subcategories, stats) {
  parent_ids <- vapply(
    strsplit(stats[["stat_id"]], "\\."),
    function(x) paste(x[1:2], collapse = "."),
    character(1)
  )

  invalid_parents <- setdiff(parent_ids, subcategories[["id"]])
  if (length(invalid_parents) > 0) {
    stop("Invalid parent subcategories found: ", paste(invalid_parents, collapse = ", "))
  }
}

# ----------------------------
# Main execution
# ----------------------------

if (file.exists("r/input/categories.rds")) {
  categories <- readRDS("r/input/categories.rds")
  print("Successfully loaded categorie categories")
} else {
  stop("Cannot find categories.rds. Make sure to run 1_prepare_input.R first")
}

if (file.exists("r/input/subcategories.rds")) {
  subcategories <- readRDS("r/input/subcategories.rds")
  print("Successfully loaded stat subcategories")
} else {
  stop("Cannot find subcategories.rds. Make sure to run 1_prepare_input.R first")
}

if (file.exists("r/input/stats.rds")) {
  stats <- readRDS("r/input/stats.rds")
  print("Successfully loaded stat stats")
} else {
  stop("Cannot find stats.rds. Make sure to run 1_prepare_input.R first")
}

validate_subcategories(categories, subcategories)
validate_stats(subcategories, stats)

output <- list()
output$config <- build_config(categories, subcategories, stats)

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, "r/output/config.json")

print("Done generating config")
print("Check output/config.json for the result")
