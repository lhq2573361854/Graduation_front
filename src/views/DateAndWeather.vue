<template>
  <v-card

      class="mx-auto"
      max-width="400"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline" >
         {{getLocation}}
        </v-list-item-title>
        <v-list-item-subtitle>{{ getCurrentDate }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col
            class="text-h6"
            cols="6"
        >{{ this.getWeatherList && this.getWeatherList[0].temp}}
          <v-subheader class="ml-1 pa-0">{{this.getWeatherList && this.getWeatherList[0].date}}</v-subheader>
        </v-col>
        <v-col cols="6">
          <v-chip-group  column
                         multiple>
            <v-chip  color="red darken-1" outlined>{{ this.getWeatherList && this.getWeatherList[0].wea}}</v-chip>
            <v-chip  color="orange" outlined>{{ this.getWeatherList && this.getWeatherList[0].air_level}}</v-chip>
          </v-chip-group>

        </v-col>
      </v-row>
    </v-card-text>

    <v-slider
        v-model="time"
        :max="6"
        :tick-labels="getWeatherTag"
        class="mx-4"
        ticks
        style="height: 100%"
    ></v-slider>

    <v-list class="transparent">
      <v-list-item
          v-for="item in getWeatherList"
          :key="item.day"
      >
        <v-list-item-title >{{ item.day }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right">
          {{ item.temp }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>


  </v-card>
</template>
<script>
import request from "@/axios";
import {format} from "@/utils";

export default {
  name: "DateAndWeather",
   async mounted() {
     const  result = await request.get("/common-api/getWeather/芜湖")
     this.weather = JSON.parse(result.data)
     setInterval(()=> {
       this.date = new Date()
     },1000)
  },
  data () {
    return {
      labels: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
      time: 0,
      forecast: [
      ],
      weather: {},
      test: [],
      weatherToChinese: {
        'qing': 'sunny',
        'yin':'cloudy',
        'yun': 'partly-cloudy',
        'yu': 'rainy',
        'wu': 'fog',
        'lei': 'lightning',
        'zhongyu': 'hail',
        'dayu': 'pouring'
      },
      weekToChinese:{
        'SU':'星期日',
        'MO':'星期一',
        'TU':'星期二',
        'WE':'星期三',
        'TH':'星期四',
        'FR':'星期五',
        'SA':'星期六'
      },
      date:new Date()
    }
  },
  methods:{
  },
  computed:{
    getLocation(){
      return this.weather.city + "·" + this.weather.country
    },
    getCurrentDate(){
      return format(this.date,"yyyy-MM-dd hh:mm:ss")
    },
    getWeatherTag(){
      return this.weather.data && this.weather.data.map(date1=>{
        let test;
        Object.keys(this.weekToChinese).forEach(key=>{
          if(this.weekToChinese[key] === date1.week)
            test = key
        })
        return test
      })
    },
    getWeatherList(){
      return  this.weather.data && this.weather.data.map(date1=>({
        day: date1.date,
        date:date1.day,
        allDate:date1.day,
        temp:`${date1.tem1} / ${date1.tem2}`,
        wea:date1.wea,
        air_level:date1.air_level,
        week:date1.week,
        icon: `mdi-weather-${this.weatherToChinese[date1["wea_day_img"]]}`,
      })).filter((value,index)=> index <= this.time + 1 && index >= this.time )
    },


  },
  filters:{
    locationDefaultInfo(value){
      if(!value) return "北京·中国"
      return value
    }
  }
}
</script>

<style scoped>

</style>
