// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";



let userTab = document.querySelector('[data-userWeather]');
let searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');

// initial variables
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let currentTab = userTab;

currentTab.classList.add('current-tab');
// ek kaam or pending hai
getfromSessionStorage();

userTab.addEventListener('click', () => {
    // pass clicked tab as input paramater
    switchTab(userTab);
});


searchTab.addEventListener('click', () => {
    // pass clicked tab as input paramater
    switchTab(searchTab);
});

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if (!searchForm.classList.contains('active')) {
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else
        {
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage()
{
    const localCoordinates=sessionStorage.getItem('user-coordinates');
    if(!localCoordinates)
    {
        // agar local coordinates ni mile
        grantAccessContainer.classList.add('active');
    }
    else
    {
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const{lat, lon}=coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove('active'); 
    loadingScreen.classList.add('active');
    // API call
    try
    {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
    }
}
function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fetch the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudyness = document.querySelector("[data-cloudyness]");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudyness.innerText = `${weatherInfo?.clouds?.all}%`;

}
function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert('no geolocation support');
    }
}
function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessbutton=document.querySelector('[data-grantAccess]');
grantAccessbutton.addEventListener('click',getLocation);

const searchInput=document.querySelector('[data-searchInput]');
searchForm.addEventListener('submit',(e)=>
{
    e.preventDefault();
    if(searchInput.value==='') return;

    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}