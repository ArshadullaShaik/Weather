const ctyinput = document.getElementById('inputplace');
const srchbtn = document.getElementById('inputbtn');
const tempout = document.getElementById('output');

srchbtn.addEventListener('click',async()=>{
    if(!srchbtn){
        console.log("button empty")
    }
    else{
        console.log("button is working")
    }
    
    
    const city = ctyinput.value.trim();
    if(!city){
        alert("please enter a city name");
        return;
    }else{
        console.log(city)
    }
    try{
        const url = `https://api.weatherapi.com/v1/current.json?key=${"68aaa73618e0486ea77164308260902"}&q=${city}`;
        const response = await fetch(url)
        console.log(response)
        if(!response.ok){
            alert("city not found or api error");
        }
        const data = await response.json();
        console.log(data)

        display(data);
    }
        catch(error){
            console.log(error);
        }});


    function display(data){
        console.log("working??");
        const temp = data.current.temp_c;
        const wind = data.current.wind_kph;

        tempout.innerHTML=`
        <h2>Weather in ${data.location.name}</h2>
        <p>temperature: ${temp}~C</p>
        <p>wind: ${wind} kph</p>`;

    }




