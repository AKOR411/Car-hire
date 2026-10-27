'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navbar = document.querySelector("[data-navbar]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navToggleFunc = function () {
  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

navToggleBtn.addEventListener("click", navToggleFunc);
overlay.addEventListener("click", navToggleFunc);

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", navToggleFunc);
}

const featuredCarFilters = document.querySelectorAll("[data-vehicle-filter]");
const featuredCarItems = document.querySelectorAll(".featured-car-list > li[data-vehicle-category]");

featuredCarFilters.forEach(function (filter) {
  filter.addEventListener("click", function () {
    const category = filter.dataset.vehicleFilter;

    featuredCarFilters.forEach(function (button) {
      const isActive = button === filter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    featuredCarItems.forEach(function (item) {
      item.hidden = category !== "all" && item.dataset.vehicleCategory !== category;
    });
  });
});



/**
 * header active on scroll
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10 ? header.classList.add("active")
    : header.classList.remove("active");
});



/**
 * rental date selection
 */

const rentalSearchForm = document.querySelector("[data-rental-search]");
const pickupLocation = document.querySelector("#pickup-location");
const pickupDate = document.querySelector("#pickup-date");
const returnDate = document.querySelector("#return-date");
const rentalSearchMessage = document.querySelector("[data-rental-search-message]");

const kisumuWardsBySubcounty = {
  "Kisumu Central": ["Railways", "Migosi", "Shaurimoyo-Kaloleni", "Market Milimani", "Kondele", "Nyalenda B"],
  "Kisumu East": ["Kajulu", "Kolwa East", "Manyatta B", "Nyalenda A", "Kolwa Central"],
  "Kisumu West": ["South West Kisumu", "Central Kisumu", "Kisumu North", "West Kisumu", "North West Kisumu"],
  Muhoroni: ["Miwani", "Ombeyi", "Masogo/Nyang'oma", "Chemelil", "Muhoroni/Koru"],
  Nyakach: ["South West Nyakach", "North Nyakach", "Central Nyakach", "West Nyakach", "South East Nyakach"],
  Nyando: ["East Kano/Wawidhi", "Awasi/Onjiko", "Ahero", "Kabonyo/Kanyagwal", "Kobura"],
  Seme: ["West Seme", "Central Seme", "East Seme", "North Seme", "South East Seme"],
};

const populateKisumuWards = function (form, subcounty) {
  const wardSelect = form.querySelector("[data-kisumu-ward]");

  if (!wardSelect) {
    return;
  }

  wardSelect.replaceChildren(new Option("Select ward", ""));
  (kisumuWardsBySubcounty[subcounty] || []).forEach(function (ward) {
    wardSelect.add(new Option(ward, ward));
  });
  wardSelect.dataset.subcounty = subcounty;
};

const updateKisumuPickupDetails = function (form, citySelect) {
  const isKisumu = citySelect.value === "Kisumu";
  const detailGroups = form.querySelectorAll(
    "[data-rental-kisumu-details], [data-booking-kisumu-details]"
  );
  const subcountySelect = form.querySelector("[data-kisumu-subcounty]");
  const wardSelect = form.querySelector("[data-kisumu-ward]");
  const areaInput = form.querySelector("[data-kisumu-area]");

  detailGroups.forEach(function (group) {
    group.hidden = !isKisumu;
  });

  if (subcountySelect) {
    subcountySelect.required = isKisumu;
    if (!isKisumu) {
      subcountySelect.value = "";
    }
  }

  if (wardSelect && subcountySelect) {
    if (!isKisumu) {
      wardSelect.value = "";
    }

    if (wardSelect.dataset.subcounty !== subcountySelect.value) {
      populateKisumuWards(form, subcountySelect.value);
    }

    const wardGroup = form.querySelector("[data-kisumu-ward-group]");
    if (wardGroup) {
      wardGroup.hidden = !isKisumu || !subcountySelect.value;
    }
    wardSelect.required = isKisumu && Boolean(subcountySelect.value);
  }

  if (areaInput) {
    const areaGroup = form.querySelector("[data-kisumu-area-group]");
    if (!isKisumu || !wardSelect?.value) {
      areaInput.value = "";
    }
    if (areaGroup) {
      areaGroup.hidden = !isKisumu || !wardSelect?.value;
    }
    areaInput.required = isKisumu && Boolean(wardSelect?.value);
  }
};

const setupKisumuPickupDetails = function (form, citySelect) {
  const subcountySelect = form.querySelector("[data-kisumu-subcounty]");
  const wardSelect = form.querySelector("[data-kisumu-ward]");

  subcountySelect?.addEventListener("change", function () {
    populateKisumuWards(form, subcountySelect.value);
    updateKisumuPickupDetails(form, citySelect);
  });
  wardSelect?.addEventListener("change", function () {
    updateKisumuPickupDetails(form, citySelect);
  });
  citySelect.addEventListener("change", function () {
    updateKisumuPickupDetails(form, citySelect);
  });
  updateKisumuPickupDetails(form, citySelect);
};

if (pickupLocation && rentalSearchForm) {
  setupKisumuPickupDetails(rentalSearchForm, pickupLocation);
}

const formatLocalDate = function (date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

if (pickupDate && returnDate && rentalSearchForm && rentalSearchMessage) {
  const today = formatLocalDate(new Date());
  pickupDate.min = today;
  returnDate.min = pickupDate.value || today;

  if (returnDate.value && returnDate.value < returnDate.min) {
    returnDate.value = returnDate.min;
  }

  pickupDate.addEventListener("change", function () {
    returnDate.min = pickupDate.value || today;

    if (returnDate.value && returnDate.value < returnDate.min) {
      returnDate.value = returnDate.min;
    }
  });

  rentalSearchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!rentalSearchForm.reportValidity()) {
      return;
    }

    const pickupDetails = pickupLocation.value === "Kisumu"
      ? ` in ${rentalSearchForm.querySelector("[data-kisumu-subcounty]").value}, ${
        rentalSearchForm.querySelector("[data-kisumu-ward]").value
      }, ${rentalSearchForm.querySelector("[data-kisumu-area]").value}`
      : "";
    rentalSearchMessage.textContent =
      `Dates selected for ${pickupLocation.value}${pickupDetails}. Live vehicle availability is not connected yet; contact Akora to confirm your booking.`;
  });
}



/**
 * interactive Kenya city map
 */

const mapElement = document.querySelector("#service-map");
const mapFallback = document.querySelector("[data-map-fallback]");
const cityButtons = document.querySelectorAll("[data-city]");
const markers = new Map();
let serviceMap = null;

const rentalCities = {
  Kisumu: [-0.0917, 34.768],
  Nairobi: [-1.2864, 36.8172],
  Mombasa: [-4.0435, 39.6682],
  Nakuru: [-0.3031, 36.08],
  Eldoret: [0.5143, 35.2698],
  Kakamega: [0.2827, 34.7519],
  Bungoma: [0.5635, 34.5606],
  Siaya: [0.0607, 34.2881],
  Migori: [-1.0634, 34.4731],
  Malindi: [-3.2175, 40.1191],
  Diani: [-4.2797, 39.594],
};

if (mapElement && mapFallback && window.L) {
  serviceMap = window.L.map(mapElement, { scrollWheelZoom: false });
  const cityBounds = [];

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 18,
  }).addTo(serviceMap);

  Object.entries(rentalCities).forEach(function ([city, coordinates]) {
    const marker = window.L.marker(coordinates).addTo(serviceMap);
    marker.bindPopup(`<strong>${city}</strong><br>City centre`);
    marker.on("click", function () {
      if (pickupLocation) {
        pickupLocation.value = city;
        pickupLocation.dispatchEvent(new Event("change"));
      }

      cityButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.city === city);
      });
    });

    markers.set(city, marker);
    cityBounds.push(coordinates);
  });

  serviceMap.fitBounds(cityBounds, { padding: [24, 24] });
  mapFallback.hidden = true;
}

cityButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const city = button.dataset.city;
    const marker = markers.get(city);

    if (pickupLocation) {
      pickupLocation.value = city;
      pickupLocation.dispatchEvent(new Event("change"));
    }

    if (serviceMap && marker) {
      serviceMap.setView(marker.getLatLng(), 10);
      marker.openPopup();
    }

    cityButtons.forEach(function (cityButton) {
      cityButton.classList.toggle("active", cityButton === button);
    });
  });
});

if (pickupLocation) {
  pickupLocation.addEventListener("change", function () {
    const marker = markers.get(pickupLocation.value);

    cityButtons.forEach(function (button) {
      button.classList.toggle("active", button.dataset.city === pickupLocation.value);
    });

    if (serviceMap && marker) {
      serviceMap.setView(marker.getLatLng(), 10);
      marker.openPopup();
    }
  });
}



/**
 * vehicle reservation requests
 */

const bookingDialog = document.querySelector("[data-booking-dialog]");
const bookingForm = document.querySelector("[data-booking-form]");
const bookingCarSummary = document.querySelector("[data-booking-car-summary]");
const bookingVehicleField = document.querySelector("[data-booking-vehicle]");
const bookingPriceField = document.querySelector("[data-booking-price]");
const bookingPickupLocation = document.querySelector("#booking-location");
const bookingPickupDate = document.querySelector("#booking-pickup-date");
const bookingReturnDate = document.querySelector("#booking-return-date");
const bookingStatus = document.querySelector("[data-booking-status]");
const bookingSubmitButton = document.querySelector("[data-booking-submit]");
const bookingCloseButton = document.querySelector("[data-booking-close]");

if (bookingForm && bookingPickupLocation) {
  setupKisumuPickupDetails(bookingForm, bookingPickupLocation);
}

const setBookingStatus = function (message, state) {
  if (!bookingStatus) {
    return;
  }

  bookingStatus.textContent = message;

  if (state) {
    bookingStatus.dataset.state = state;
  } else {
    delete bookingStatus.dataset.state;
  }
};

if (bookingDialog && bookingForm && bookingPickupLocation && bookingPickupDate && bookingReturnDate) {
  const today = formatLocalDate(new Date());
  bookingPickupDate.min = today;
  bookingReturnDate.min = today;

  bookingPickupDate.addEventListener("change", function () {
    bookingReturnDate.min = bookingPickupDate.value || today;
    bookingReturnDate.setCustomValidity("");

    if (bookingReturnDate.value && bookingReturnDate.value < bookingReturnDate.min) {
      bookingReturnDate.value = bookingReturnDate.min;
    }
  });

  bookingReturnDate.addEventListener("change", function () {
    bookingReturnDate.setCustomValidity("");
  });

  document.querySelectorAll("[data-reserve-car]").forEach(function (button) {
    button.addEventListener("click", function () {
      const carCard = button.closest(".featured-car-card");

      if (!carCard) {
        return;
      }

      const carName = carCard.querySelector(".card-title a")?.textContent.trim();
      const carYear = carCard.querySelector(".year")?.textContent.trim();
      const carPrice = carCard.querySelector(".card-price")?.textContent.replace(/\s+/g, " ").trim();

      if (!carName || !carYear || !carPrice) {
        setBookingStatus("We could not load this vehicle's details. Please contact Akora directly.", "error");
        bookingDialog.showModal();
        return;
      }

      const vehicle = `${carName} (${carYear})`;
      bookingCarSummary.textContent = `${vehicle} · ${carPrice}`;
      bookingVehicleField.value = vehicle;
      bookingPriceField.value = carPrice;
      bookingPickupLocation.value = pickupLocation?.value || "Kisumu";
      updateKisumuPickupDetails(bookingForm, bookingPickupLocation);

      if (bookingPickupLocation.value === "Kisumu" && rentalSearchForm) {
        const bookingSubcounty = bookingForm.querySelector("[data-kisumu-subcounty]");
        bookingSubcounty.value = rentalSearchForm.querySelector("[data-kisumu-subcounty]").value;
        bookingSubcounty.dispatchEvent(new Event("change"));
        bookingForm.querySelector("[data-kisumu-ward]").value =
          rentalSearchForm.querySelector("[data-kisumu-ward]").value;
        bookingForm.querySelector("[data-kisumu-ward]").dispatchEvent(new Event("change"));
        bookingForm.querySelector("[data-kisumu-area]").value =
          rentalSearchForm.querySelector("[data-kisumu-area]").value;
      }

      bookingPickupDate.value = pickupDate?.value || "";
      bookingReturnDate.value = returnDate?.value || "";
      bookingReturnDate.min = bookingPickupDate.value || today;

      if (bookingReturnDate.value && bookingReturnDate.value < bookingReturnDate.min) {
        bookingReturnDate.value = bookingReturnDate.min;
      }

      bookingForm.hidden = false;
      bookingSubmitButton.disabled = false;
      bookingSubmitButton.textContent = "Send reservation request";
      setBookingStatus("", "");
      bookingDialog.showModal();
    });
  });

  bookingCloseButton?.addEventListener("click", function () {
    bookingDialog.close();
  });

  bookingDialog.addEventListener("click", function (event) {
    if (event.target === bookingDialog) {
      bookingDialog.close();
    }
  });

  bookingDialog.addEventListener("close", function () {
    bookingForm.reset();
    updateKisumuPickupDetails(bookingForm, bookingPickupLocation);
    bookingForm.hidden = false;
    bookingSubmitButton.disabled = false;
    bookingSubmitButton.textContent = "Send reservation request";
    setBookingStatus("", "");
  });

  bookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
      return;
    }

    if (bookingReturnDate.value < bookingPickupDate.value) {
      bookingReturnDate.setCustomValidity("Return date must be on or after the pickup date.");
      bookingReturnDate.reportValidity();
      return;
    }

    bookingReturnDate.setCustomValidity("");
    bookingSubmitButton.disabled = true;
    bookingSubmitButton.textContent = "Sending request...";
    setBookingStatus("Sending your reservation request securely...", "");

    try {
      const response = await fetch("https://formspree.io/f/xnpppyyz", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: new FormData(bookingForm),
      });
      const result = await response.json();

      if (!response.ok || result.ok === false) {
        const responseErrors = Array.isArray(result.errors)
          ? result.errors.map(function (item) { return item.message; }).filter(Boolean).join(" ")
          : "";
        throw new Error(responseErrors || result.error || "The reservation request could not be sent.");
      }

      bookingForm.hidden = true;
      setBookingStatus(
        "Your request was submitted. Akora will contact you to confirm availability and delivery. No online payment was taken.",
        "success"
      );
    } catch (error) {
      console.error("Reservation request failed:", error);
      bookingSubmitButton.disabled = false;
      bookingSubmitButton.textContent = "Try sending again";
      setBookingStatus(
        "We could not send your request. Please try again or contact Akora by phone or email below.",
        "error"
      );
    }
  });

  const requestedCarId = new URLSearchParams(window.location.search).get("reserve");

  if (requestedCarId) {
    const requestedCarButton = Array.from(document.querySelectorAll("[data-reserve-car]"))
      .find(function (button) {
        return button.dataset.carId === requestedCarId;
      });

    if (requestedCarButton) {
      requestedCarButton.click();
      window.history.replaceState(null, "", `${window.location.pathname}#featured-car`);
    }
  }
}
