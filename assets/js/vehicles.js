'use strict';

const catalogList = document.querySelector("[data-catalog-list]");
const vehicleCards = Array.from(document.querySelectorAll("[data-vehicle-card]"));
const searchInput = document.querySelector("#vehicle-search");
const maxPriceInput = document.querySelector("#max-price");
const maxPriceOutput = document.querySelector("[data-max-price-output]");
const sortSelect = document.querySelector("#sort-vehicles");
const resultCount = document.querySelector("[data-results-count]");
const emptyMessage = document.querySelector("[data-catalog-empty]");
const clearFiltersButton = document.querySelector("[data-clear-filters]");

const updateCatalog = function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const maxPrice = Number(maxPriceInput.value);
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map(function (input) {
    return input.value;
  });
  const selectedSeats = Array.from(
    document.querySelectorAll('input[name="seats"]:checked')
  ).map(function (input) {
    return Number(input.value);
  });

  vehicleCards.forEach(function (card) {
    const matchesSearch = card.dataset.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(card.dataset.category);
    const seats = Number(card.dataset.seats);
    const matchesSeats =
      selectedSeats.length === 0 ||
      selectedSeats.some(function (minimumSeats) {
        return minimumSeats === 4 ? seats === 4 : seats >= minimumSeats;
      });
    const matchesPrice = Number(card.dataset.price) <= maxPrice;

    card.hidden = !(matchesSearch && matchesCategory && matchesSeats && matchesPrice);
  });

  const sortOrder = sortSelect.value;
  const sortedCards = vehicleCards.slice().sort(function (first, second) {
    if (sortOrder === "price-low") {
      return Number(first.dataset.price) - Number(second.dataset.price);
    }

    if (sortOrder === "price-high") {
      return Number(second.dataset.price) - Number(first.dataset.price);
    }

    if (sortOrder === "name") {
      return first.dataset.name.localeCompare(second.dataset.name);
    }

    return Number(first.dataset.order) - Number(second.dataset.order);
  });

  sortedCards.forEach(function (card) {
    catalogList.insertBefore(card, emptyMessage);
  });

  const visibleCount = vehicleCards.filter(function (card) {
    return !card.hidden;
  }).length;

  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "vehicle" : "vehicles"}`;
  emptyMessage.hidden = visibleCount > 0;
  maxPriceOutput.value = `$${maxPrice} / month`;
  maxPriceOutput.textContent = `$${maxPrice} / month`;
};

[searchInput, maxPriceInput, sortSelect].forEach(function (control) {
  control.addEventListener("input", updateCatalog);
  control.addEventListener("change", updateCatalog);
});

document.querySelectorAll('input[name="category"], input[name="seats"]').forEach(function (control) {
  control.addEventListener("change", updateCatalog);
});

clearFiltersButton.addEventListener("click", function () {
  searchInput.value = "";
  maxPriceInput.value = maxPriceInput.max;
  sortSelect.value = "featured";
  document.querySelectorAll('input[name="category"], input[name="seats"]').forEach(function (control) {
    control.checked = false;
  });
  updateCatalog();
});

updateCatalog();
