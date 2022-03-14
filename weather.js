const form = document.querySelector(".top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const cityList = document.querySelector(".ajax-section .cities");

localStorage.setItem(
  "apikey",
  EncryptStringAES("5fe5f6b3301f8311fe998acd9061f372")
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  let apikey = DecryptStringAES(localStorage.getItem("apikey"));
  let inputVal = input.value;
  let units = "metric";
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apikey}&units=${units}`;

  try {
    const response = await axios({
      url: `${urlApi}`,
      method: "get",
    });
    console.log(response.data);
    const { main, name, sys, weather } = response.data;
    let cityCardList = cityList.querySelectorAll(".city");
    let cityCardListArray = Array.from(cityCardList);

    if (cityCardListArray.length > 0) {
      const filteredArray = cityCardListArray.filter(
        (card) => card.querySelector(".city-name span").innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
        setTimeout(() => {
          msg.innerText = "";
        }, 3500);
        form.reset();
        input.focus();
        return;
      }
    }

    // image url
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    let createdCityCardLi = document.createElement("li");
    createdCityCardLi.classList.add("city");
    createdCityCardLi.innerHTML = `
    <h2 class="city-name" data-name="${name}, ${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>  `;
    cityList.prepend(createdCityCardLi);
    form.reset();
    input.focus();
  } catch (error) {
    msg.innerText = error;
    setTimeout(() => {
      msg.innerText = "";
    }, 3500);
  }
};
