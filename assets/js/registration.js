"use strict";

const formspreeEndpoint = "https://formspree.io/f/xnpppyyz";
const registrationPanel = document.querySelector("[data-registration-panel]");
const registrationForms = document.querySelectorAll("[data-registration-form]");
const registrationTitle = document.querySelector("#registration-form-title");
const reviewDialog = document.querySelector("[data-review-dialog]");
const reviewSummary = document.querySelector("[data-review-summary]");
const confirmApplicationButton = document.querySelector("[data-confirm-application]");
const closeReviewButton = document.querySelector("[data-close-review]");
const editApplicationButton = document.querySelector("[data-edit-application]");
const closeRegistrationButton = document.querySelector("[data-close-registration]");
let activeRegistrationForm = null;
let sendingApplication = false;

const setRegistrationStatus = function (form, message, status) {
  const statusElement = form.querySelector("[data-registration-status]");
  statusElement.textContent = message;
  statusElement.dataset.status = status || "";
};

const validateApplicationFiles = function (form) {
  const fileInputs = form.querySelectorAll("[data-application-files]");
  const acceptedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
  let totalSize = 0;

  for (const input of fileInputs) {
    for (const file of input.files) {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

      if (!acceptedExtensions.includes(extension)) {
        return "Choose PDF, JPG, or PNG files only.";
      }

      if (file.size > 5 * 1024 * 1024) {
        return "Each supporting file must be 5 MB or smaller.";
      }

      totalSize += file.size;
    }
  }

  if (totalSize > 10 * 1024 * 1024) {
    return "The combined size of supporting files must be 10 MB or smaller.";
  }

  return "";
};

const getFieldLabel = function (field) {
  if (!field.id) {
    return field.name;
  }

  const label = document.querySelector('label[for="' + field.id + '"]');
  return label ? label.textContent.replace(/\s+/g, " ").trim() : field.name;
};

const addReviewItem = function (label, value) {
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  reviewSummary.append(term, description);
};

const buildReview = function (form) {
  reviewSummary.replaceChildren();

  for (const field of form.elements) {
    if (!field.name || ["hidden", "submit", "button", "file"].includes(field.type)) {
      continue;
    }

    if (field.type === "checkbox") {
      continue;
    }

    const value = field.value.trim();
    if (value) {
      addReviewItem(getFieldLabel(field), value);
    }
  }

  for (const input of form.querySelectorAll("[data-application-files]")) {
    if (input.files.length) {
      addReviewItem(getFieldLabel(input), Array.from(input.files).map(function (file) {
        return file.name;
      }).join(", "));
    }
  }
};

const openRegistrationForm = function (category) {
  const matchingForm = document.querySelector('[data-registration-form="' + category + '"]');
  if (!matchingForm) {
    return;
  }

  registrationForms.forEach(function (form) {
    form.hidden = form !== matchingForm;
  });
  registrationPanel.hidden = false;
  registrationTitle.textContent = matchingForm.dataset.registrationTitle;
  setRegistrationStatus(matchingForm, "", "");
  registrationPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  matchingForm.querySelector("input:not([type='hidden'])").focus({ preventScroll: true });
};

document.querySelectorAll("[data-open-registration]").forEach(function (button) {
  button.addEventListener("click", function () {
    openRegistrationForm(button.dataset.openRegistration);
  });
});

closeRegistrationButton.addEventListener("click", function () {
  registrationPanel.hidden = true;
  document.querySelector("[data-open-registration]").focus();
});

registrationForms.forEach(function (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const fileError = validateApplicationFiles(form);
    if (fileError) {
      setRegistrationStatus(form, fileError, "error");
      return;
    }

    activeRegistrationForm = form;
    buildReview(form);
    reviewDialog.showModal();
  });
});

const sendApplication = async function () {
  if (!activeRegistrationForm || sendingApplication) {
    return;
  }

  sendingApplication = true;
  confirmApplicationButton.disabled = true;
  confirmApplicationButton.textContent = "Sending application...";
  closeReviewButton.disabled = true;
  editApplicationButton.disabled = true;

  try {
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(activeRegistrationForm),
    });
    const result = await response.json();

    if (!response.ok || result.ok === false) {
      const responseErrors = Array.isArray(result.errors)
        ? result.errors.map(function (item) { return item.message; }).filter(Boolean).join(" ")
        : "";
      throw new Error(responseErrors || result.error || "The application could not be sent.");
    }

    const submittedForm = activeRegistrationForm;
    reviewDialog.close();
    submittedForm.reset();
    setRegistrationStatus(
      submittedForm,
      "Your application was sent to Akora. The team will contact you using the details provided.",
      "success"
    );
    registrationPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Network application failed:", error);
    setRegistrationStatus(
      activeRegistrationForm,
      "We could not send your application. Please try again or contact Akora by phone or email.",
      "error"
    );
    reviewDialog.close();
  } finally {
    sendingApplication = false;
    confirmApplicationButton.disabled = false;
    confirmApplicationButton.textContent = "Send application";
    closeReviewButton.disabled = false;
    editApplicationButton.disabled = false;
  }
};

confirmApplicationButton.addEventListener("click", sendApplication);

closeReviewButton.addEventListener("click", function () {
  if (!sendingApplication) {
    reviewDialog.close();
  }
});

editApplicationButton.addEventListener("click", function () {
  reviewDialog.close();
  if (activeRegistrationForm) {
    activeRegistrationForm.querySelector(":invalid")?.focus();
  }
});
