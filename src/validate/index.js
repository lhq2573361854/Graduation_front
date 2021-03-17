import { helpers } from 'vuelidate/lib/validators'



export const phone = helpers.regex('手机号必须1开头的11位数字', /^1\d{10}$/ );


export const indexof = helpers.withParams(
    { type: "rule", value: "必须包含cool字符串" },
    ( value ) => !helpers.req( value ) || value.indexOf( "cool" ) >= 0,
);






