//Global variables

var searchButton = document.querySelector("#search-button");
var todayTitle = document.querySelector("#today-title");
var todayIcon = document.querySelector("#today-icon");
var weatherToday = document.querySelector("#today-weather");
var forecast = document.querySelector("#five-day");
var weatherContainer = document.getElementById("today-container");
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var cityHistory = document.querySelector("#history");
// var cityButton = 

saveSearchValue(); 

searchButton.addEventListener("click", getSearchValue);

//This is the starter function that runs when the button is clicked, it saves the city input and calls teh other functions that p
function getSearchValue () {
    var searchValue = document.querySelector("#search-value").value;
    
    if (searchValue == "") {
        alert("Opps! Please enter a valid city!");
        return false;
    }

    if (!cities.includes(searchValue)) {
    cities.unshift(searchValue);
    localStorage.setItem("cities", JSON.stringify(cities));
    //set up validation if form is blank
    getWeather(searchValue);
    getFiveDays(searchValue); 
    saveSearchValue(); 
    } 

    document.querySelector("#search-value").value = "";

}

//This takes the stored cities searched and adds them to the aside as a list of buttons.
function saveSearchValue () {  
  cityHistory.innerHTML="";
    console.log(cities)
    for (var i = 0; i < cities.length; i++) {
    var prevCity = document.createElement("button");
    
    
    cityHistory.appendChild(prevCity);
    prevCity.setAttribute("cityName", cities[i])
    prevCity.textContent = cities[i];
    prevCity.addEventListener("click", function() {
        getWeather(this.getAttribute("cityName"));
        getFiveDays(this.getAttribute("cityName"));
    })
    cityHistory.append(prevCity);
    }
}




//This will get the current weather for the day.
function getWeather (searchValue) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey + "&units=imperial";

    weatherContainer.style.border = "1px solid skyblue";  

    //This is getting the data from the Weather API.
    fetch(apiUrl)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
        

        var cityName = data.name


        //This is what displays the current date.
        var todayDate = moment().format("MM/DD/YYYY");
    
        //This sets the coordinates as variables to use in the url to get the UV Index and calls that funtion.
        var longitude = data.coord.lon;
        var latitude = data.coord.lat;
        uvIndex(latitude, longitude); 

        //This is the text to be displayed on the page. 
        var title = data.name + " " + todayDate;
        var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
        var  temp = "Temperature: " + data.main.temp + " ° F";
        var  wind = "Windspeed: " + data.wind.speed + " MPH";
        var  humidity = "Humidity Level: " + data.main.humidity + " %";      

        //This creates the html element to be filled.
        var titleItem = document.createElement("h3")
        var tempItem = document.createElement("li")
        var windItem = document.createElement("li")
        var humidityItem = document.createElement("li")
        var iconItem = document.createElement("img")

        //This gives the elements text.
        titleItem.textContent = title 
        tempItem.textContent = temp
        windItem.textContent = wind
        humidityItem.textContent = humidity
        iconItem.setAttribute("src", iconUrl)

        //This puts the elements containing weather data onto the page.
        todayTitle.append(titleItem);//float left
        todayTitle.append(iconItem);
        weatherToday.append(tempItem);
        weatherToday.append(windItem);
        weatherToday.append(humidityItem);

    }) 
   
    //This is gathering the UV Index data and put it on the page with the other data above.
    function uvIndex (latitude, longitude) {
        var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey
        //This is getting UV index data.
        fetch(uvUrl)
            .then(function (response) {
            return response.json()
            }).then(function (data) {
            
            //This appends it to the page.
            var uvValue = data.current.uvi;
            var  uv = "UV Index: " + uvValue
            var uvItem = document.createElement("p")
            uvItem.textContent = uv
            weatherToday.append(uvItem);

            if (uvValue <= 2) {
                uvItem.setAttribute("class", "favorable")
            } else if (uvValue > 2 && uvValue < 6) {
                uvItem.setAttribute("class", "moderate")
            } else {
                uvItem.setAttribute("class", "severe")
            }

        })

       
    }

    //This clears the previous city's data when a new city is searched and displayed.
    todayTitle.innerHTML = "";
    weatherToday.innerHTML = "";
}

//This will get the weather for next 5 days.
//****** NEED HELP! y dis no work, tho?
function getFiveDays (searchValue) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey + "&units=imperial";

    fetch(apiUrl)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data);

            forecast.innerHTML = "";
        
        var day = 1;
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.indexOf('15:00:00') !== -1){

            var todayDate = moment().add(day, 'days').format("MM/DD/YYYY");
            var date = todayDate;
            var iconUrl = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
            var temp = "Temp: " + data.list[i].main.temp + " ° F";
            var wind = "Wind: " + data.list[i].wind.speed + " MPH";
            var humidity = "Humidity: " + data.list[i].main.humidity + " %"; 

            var cardItem = document.createElement("div");
            cardItem.classList.add("card");
            

            var dateItem = document.createElement("h4");
            var iconItem = document.createElement("img");
            var tempItem = document.createElement("li");
            var windItem = document.createElement("li");
            var humidityItem = document.createElement("li");
    
            dateItem.textContent = date;
            iconItem.setAttribute("src", iconUrl);
            tempItem.textContent = temp;
            windItem.textContent = wind;
            humidityItem.textContent = humidity;

            cardItem.append(dateItem);
            cardItem.append(iconItem);
            cardItem.append(tempItem);
            cardItem.append(windItem);
            cardItem.append(humidityItem);

            console.log(dateItem);
            forecast.append(cardItem);

            day++;
        
        }
   

    }


    })   
}




