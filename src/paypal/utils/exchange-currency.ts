// import { request } from 'request';

// class Currency {
//   private readonly url = 'https://openexchangerates.org/api/latest.json';

//   constructor(
//     private readonly from: string = 'VND',
//     private readonly to: string = 'USD',
//   ) {}

//   getcurrency(amount: number) {
//     const self = this;
//     const query = {
//       app_id: appID,
//       base: self.from,
//     };
//     const options = {
//       url: self.url,
//       qs: query,
//       timeout: 5000,
//     };

//     return new Promise((resolve, reject) => {
//       request(options, (error, response, body) => {
//         if (!error) {
//           const data = JSON.parse(body);

//           const rates = {
//             VND: data.rates.VND,
//             USD: data.rates.USD,
//           };

//           fx.base = data.base;
//           fx.rates = rates;

//           resolve(fx.convert(amount, { from: this.from, to: this.to }));
//         } else {
//           reject({
//             error: error,
//           });
//         }
//       });
//     });
//   }
// }
