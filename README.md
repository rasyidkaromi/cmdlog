# cmdlog

<div>
  <br>
</div>


**Install :**

- install depedencies npm install or yarn
- download csv file [transactions.csv](https://drive.google.com/file/d/1DY5uUfSqHt1AtbWCuaKJBlbnwlvFI7YS) and save the file in the source folder
- npm run build 
- npm build-bin

------------------------------------------------------------

**Run and execute command-line or with binary app.exe file on windows :**

- $ ./app
- $ node dist/app.js

`Given no parameters, return the latest portfolio value per token in USD`

```
[
  { Token: 'BTC', Value: '0.298660', USD: '4898.9498459999995' },
  { Token: 'ETH', Value: '0.683640', USD: '821.0106216' },
  { Token: 'XRP', Value: '0.693272', USD: '0.2553320776' }
]
```

- $ ./app --token BTC
- $ node dist/app.js --token BTC

`Given a token, return the latest portfolio value for that token in USD`

```
[ { Token: 'BTC', Value: '0.298660', USD: '4901.0225464' } ]
```

- $ ./app --date 10/25/2019 
- $ node dist/app.js --date 10/25/2019 

`MM/DD/YYYY`

`Given a date, return the portfolio value per token in USD on that date`

```
[
  {
    Token: 'XRP',
    Value: '0.601717',
    USD: '0.16715698259999998',
    Date: '10/24/19, 11:58:30 PM'
  },
  {
    Token: 'BTC',
    Value: '0.031415',
    USD: '235.0005358',
    Date: '10/24/19, 11:58:08 PM'
  },
  {
    Token: 'BTC',
    Value: '0.740358',
    USD: '5538.26282616',
    Date: '10/24/19, 11:57:43 PM'
  },
  {
    Token: 'BTC',
    Value: '0.761977',
    USD: '5699.984188040001',
    Date: '10/24/19, 11:56:22 PM'
  },
  {
    Token: 'ETH',
    Value: '0.627446',
    USD: '102.22977678',
    Date: '10/24/19, 11:55:50 PM'
  },
    ... more items
]
```

- $ ./app --date 10/25/2019 --token BTC
- $ node dist/app.js --date 10/25/2019 --token BTC

`MM/DD/YYYY`

`Given a date and a token, return the portfolio value of that token in USD on that date`

```
[
  {
    Token: 'BTC',
    Value: '0.031415',
    USD: '235.0005358',
    Date: '10/24/19, 11:58:08 PM'
  },
  {
    Token: 'BTC',
    Value: '0.740358',
    USD: '5538.26282616',
    Date: '10/24/19, 11:57:43 PM'
  },
  {
    Token: 'BTC',
    Value: '0.761977',
    USD: '5699.984188040001',
    Date: '10/24/19, 11:56:22 PM'
  },
  {
    Token: 'BTC',
    Value: '0.286457',
    USD: '2142.8473176400003',
    Date: '10/24/19, 11:54:23 PM'
  },
    ... more items
]
```
------------------------------------------------------------

