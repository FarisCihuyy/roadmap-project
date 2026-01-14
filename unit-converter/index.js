const formContainer = document.getElementById("form-container");

document.addEventListener("DOMContentLoaded", () => {
  loadHtml("./length.html");
});

const loadHtml = (src) => {
  fetch(src)
    .then((response) => response.text())
    .then((html) => {
      formContainer.innerHTML = html;

      document.querySelectorAll(".nav button").forEach((button) => {
        button.classList.remove("active");
      });

      document
        .querySelector(`[onClick="loadHtml('${src}')"]`)
        .classList.add("active");
      document.getElementById("result").style.display = "none";
    });
};

const convert = (e, type) => {
  e.preventDefault();

  const value = Number(document.getElementById(`${type}-value`).value);
  const from = document.getElementById(`${type}-from`).value;
  const to = document.getElementById(`${type}-to`).value;

  let convertedValue;

  switch (type) {
    case "length": {
      const lengthUnits = {
        meters: 1,
        kilometers: 0.001,
        feet: 3.28084,
        miles: 0.000621371,
      };

      const valueInMeters = value / lengthUnits[from];
      convertedValue = valueInMeters * lengthUnits[to];
      break;
    }

    case "weight": {
      const weightUnits = {
        grams: 1,
        kilograms: 0.001,
        pounds: 2.20462,
        ounces: 0.035274,
      };

      const valueInGrams = value / weightUnits[from];
      convertedValue = valueInGrams * weightUnits[to];
      break;
    }

    case "temperature": {
      const temperatureUnits = {
        celsius: {
          name: "Celsius",
          toCelsius: (v) => v,
          fromCelsius: (v) => v,
        },
        fahrenheit: {
          name: "Fahrenheit",
          toCelsius: (v) => ((v - 32) * 5) / 9,
          fromCelsius: (v) => (v * 9) / 5 + 32,
        },
        kelvin: {
          name: "Kelvin",
          toCelsius: (v) => v - 273.15,
          fromCelsius: (v) => v + 273.15,
        },
      };

      const celsius = temperatureUnits[from].toCelsius(value);
      convertedValue = temperatureUnits[to].fromCelsius(celsius);
      break;
    }

    default:
      console.log("Invalid type");
      return;
  }

  formContainer.style.display = "none";

  document.querySelector(".converter").textContent = `${from} → ${to}`;
  document.getElementById("from").textContent = value;
  document.getElementById("to").textContent = convertedValue.toFixed(2);
  document.getElementById("result").style.display = "block";
};

const reset = () => {
  document.getElementById("result").style.display = "none";
  formContainer.style.display = "block";
};
