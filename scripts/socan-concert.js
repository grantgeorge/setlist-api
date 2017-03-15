const rp = require('request-promise')
const request = require('request')
const _ = require('lodash')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

let baseUrl = 'https://api.socan.ca/sandbox/SubmitNLMP'
let apiKey = 'l7xx50540a4a671342868a65f8a8f4a71d7a'

let postUri = `${baseUrl}?apiKey=${apiKey}`

// let postParams = {
//   MARIE_NO: '',
//   CANADIAN_PERFORMANCE: '',
//   TYPE_OF_PROGRAM: '',
//   ARTIST_NAME: '',
//   PROOF_TYPE: '',
//   DATE_OF_PROGRAM: '',
//   VENUE: '',
//   VENUETYPE: '',
//   VENUECAPACITY: '',
//   STREET1: '',
//   CITY: '',
//   PROVINCE: '',
//   POSTAL_CODE: '',
//   COUNTRY: '',
//   VENUE_PHONE: '',
//   VENUE_WEBSITE: '',
//   PERFORMANCE_TIME: '',
//   PROMOTER: '',
//   PROMOTER_STREET1: '',
//   PROMOTER_CITY: '',
//   PROMOTER_PROVINCE: '',
//   PROMOTER_POSTAL_CODE: '',
//   PROMOTER_COUNTRY: '',
//   PROMOTER_TELEPHONE: '',
//   compositions: [
//     {
//       ORIGINAL_TITLE: '',
//       COMPOSER: '',
//       WORK_NO: ''
//     },
//     {
//       ORIGINAL_TITLE: '',
//       COMPOSER: '',
//       WORK_NO: ''
//     }
//   ]
// }

let nlmpJSON = {
   "MARIE_NO":"777777777",
   "CANADIAN_PERFORMANCE":"c",
   "TYPE_OF_PROGRAM":"sc",
   "ARTIST_NAME":"AGENT STUFFIN",
   "PROOF_TYPE":"contract",
   "DATE_OF_PROGRAM":"2017/01/01",
   "VENUE":"SOCAN",
   "VENUETYPE":"cfs",
   "VENUECAPACITY":"l5",
   "STREET1":"41 Valleybrook",
   "CITY":"Toronto",
   "PROVINCE":"ON",
   "POSTAL_CODE":"m3b 2s6",
   "COUNTRY":"can",
   "VENUE_PHONE":"4164458700",
   "VENUE_WEBSITE":"www.socan.ca",
   "PERFORMANCE_TIME":"1 : 30 pm",
   "PROMOTER":"SOCAN",
   "PROMOTER_STREET1":"41 Valleybrook",
   "PROMOTER_CITY":"Toronto",
   "PROMOTER_PROVINCE":"ON",
   "PROMOTER_POSTAL_CODE":"M3B2S6",
   "PROMOTER_COUNTRY":"CAN",
   "PROMOTER_TELEPHONE":"4164458700",
   "compositions":[
      { "ORIGINAL_TITLE":"SOCAN","COMPOSER":"John Doe" },
      { "ORIGINAL_TITLE":"HACKATHON","COMPOSER":"John Doe" }
   ]
}

let reqOptions = {
  method: 'POST',
  uri: postUri,
  // preambleCRLF: true,
  // postambleCRLF: true,
  multipart: [
    {
      'content-type': 'application/json',
      body: JSON.stringify({ nlmp: nlmpJSON })
      // body: JSON.stringify(nlmpJSON)
    },
  ],
  headers: {
    'content-type': 'multipart/form-data'
  }
  // formData: JSON.stringify(postParams),
  // json: true
  // cert: fs.readFileSync(certFile),
  // key: fs.readFileSync(keyFile),
  // ca: fs.readFileSync(caFile),
  // passphrase: '',
  // custom_file: {
  //   value: fs.createReadStream('/Users/0x67/Desktop/top-secret.xlsx'),
  // },
}

// rp(reqOptions)
//   .then(parsedBody => {
//     // console.log(parsedBody)
//     console.log('success')
//     process.exit(0)
//   })
//   .catch(err => {
//     console.log(err)
//     // process.exit(1)
//   })

request.post(reqOptions, function(err, httpResponse, body) {
  if (err) {
    return console.error('failure: ', err)
  }
  // console.log(httpResponse.body)
  console.log('successful response')
  console.log(body)
})

// string nlmpJSON = {
//   MARIE_NO: '9999999',
//   CANADIAN_PERFORMANCE: 'c',
//   TYPE_OF_PROGRAM: 'sc',
//   ARTIST_NAME: 'Jane Doe',
//   PROOF_TYPE: 'contract',
//   DATE_OF_PROGRAM: '2016/03/24',
//   VENUE: 'SOCAN',
//   VENUETYPE: 'cfs',
//   VENUECAPACITY: 'L3',
//   STREET1: '41 Valleybrook',
//   CITY: 'Toronto',
//   PROVINCE: 'ON',
//   POSTAL_CODE: 'M3B 2S6',
//   COUNTRY: 'can',
//   VENUE_PHONE: '416 4458700',
//   VENUE_WEBSITE: 'www.socan.ca',
//   PERFORMANCE_TIME: '2 : 30 pm',
//   PROMOTER: 'SOCAN',"
//   PROMOTER_STREET1: '41 Valleybrook',
//   PROMOTER_CITY: 'Toronto',
//   PROMOTER_PROVINCE: 'ON',"
//   PROMOTER_POSTAL_CODE: 'M3B 2S6',
//   PROMOTER_COUNTRY: 'CAN',
//   PROMOTER_TELEPHONE: '4164458700',"
//   compositions: ["
//     "{'ORIGINAL_TITLE: \"Bécik\",\"COMPOSER: \"Alice Tougas St-Jacques, Annie Carpentier, Antoine Tardif,
//     B\",\"WORK_NO: \"75333935\"},"
//     "{\"ORIGINAL_TITLE: \"Game of Thrones\",\"COMPOSER: \"Ramin Djawadi\",\"WORK_NO: \"78609167\"}"
//     "]"
//   "}"

// EXAMPLE:
// string nlmpJSON = "{" +
// "\"MARIE_NO\":\"9999999\"," +
// "\"CANADIAN_PERFORMANCE\":\"c\", " +
// "\"TYPE_OF_PROGRAM\":\"sc\", " +
// "\"ARTIST_NAME\":\"Jane Doe\", " +
// "\"PROOF_TYPE\":\"contract\", " +
// "\"DATE_OF_PROGRAM\":\"2016/03/24\", " +
// "\"VENUE\":\"SOCAN\", " +
// "\"VENUETYPE\":\"cfs\", " +
// "\"VENUECAPACITY\":\"L3\", " +
// "\"STREET1\":\"41 Valleybrook\", " +
// "\"CITY\":\"Toronto\", " +
// "\"PROVINCE\":\"ON\", " +
// "\"POSTAL_CODE\":\"M3B 2S6\", " +
// "\"COUNTRY\":\"can\", " +
// "\"VENUE_PHONE\":\"416 4458700\", " +
// "\"VENUE_WEBSITE\":\"www.socan.ca\", " +
// "\"PERFORMANCE_TIME\":\"2 : 30 pm\", " +
// "\"PROMOTER\":\"SOCAN\"," +
// "\"PROMOTER_STREET1\":\"41 Valleybrook\",
// "\"PROMOTER_PROVINCE\":\"ON\"," +
// "\"PROMOTER_POSTAL_CODE\":\"M3B 2S6\", " +
// "\"PROMOTER_COUNTRY\":\"CAN\", " +
// "\"PROMOTER_TELEPHONE\":\"4164458700\"," +
// "\"compositions\":[" +
// "{\"ORIGINAL_TITLE\":\"Bécik\",\"COMPOSER\":\"Alice Tougas St-Jacques, Annie Carpentier, Antoine Tardif,
// B\",\"WORK_NO\":\"75333935\"}," +
// "{\"ORIGINAL_TITLE\":\"Game of Thrones\",\"COMPOSER\":\"Ramin Djawadi\",\"WORK_NO\":\"78609167\"}" +
// "]" +
// "}"

// console.log(postUrl)

// string webMethod = "?apiKey=" apiKey
// …
// ServicePointManager.ServerCertificateValidationCallback = delegate {
