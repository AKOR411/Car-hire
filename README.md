<div align="center">

  <a href="https://github.com/AKOR411/Car-hire">
    <img src="./assets/images/logo.svg" alt="Akora Prime Wheels" width="300">
  </a>

  <h1>Akora Prime Wheels</h1>

  <p>Car hire based in Kisumu, Kenya. Browse manually maintained vehicle listings and send a reservation request directly to Akora.</p>

  <p>
    <a href="https://github.com/AKOR411/Car-hire">
      <img src="https://img.shields.io/github/repo-size/AKOR411/Car-hire?label=repository%20size" alt="GitHub repository size">
    </a>
    <a href="https://github.com/AKOR411/Car-hire/stargazers">
      <img src="https://img.shields.io/github/stars/AKOR411/Car-hire?style=social" alt="GitHub stars">
    </a>
    <a href="https://github.com/AKOR411/Car-hire/network/members">
      <img src="https://img.shields.io/github/forks/AKOR411/Car-hire?style=social" alt="GitHub forks">
    </a>
  </p>

  <p><a href="https://github.com/AKOR411/Car-hire"><strong>View the Akora project on GitHub</strong></a></p>

</div>

## Project status

The website is a static HTML, CSS, and JavaScript project. A public live demo is not currently deployed. The vehicle catalogue is maintained manually and does not provide live availability or confirmed bookings. Reservation requests are sent to Akora by email; payment is due after vehicle delivery.

## Vehicle listings

The **View more** link opens [`vehicles.html`](./vehicles.html), where visitors can search, filter, and sort the manually maintained listings. Displayed rates are in Kenyan shillings (KES) per day and should be kept in sync between [`vehicles.html`](./vehicles.html) and the featured cards in [`index.html`](./index.html). Confirm the applicable vehicle rate and terms with Akora when handling each reservation.

## Run locally

Install [Git](https://git-scm.com/downloads) and [Python 3](https://www.python.org/downloads/), then run:

```bash
git clone https://github.com/AKOR411/Car-hire.git
cd Car-hire
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. On Windows, use `py -m http.server 8000` if the `python` command is unavailable.

## Contact

- Phone / WhatsApp: [+254 705 036 665](https://wa.me/254705036665)
- Email: [akora.danielfredrick@gmail.com](mailto:akora.danielfredrick@gmail.com)
- Repository: [github.com/AKOR411/Car-hire](https://github.com/AKOR411/Car-hire)

## License

This repository does not currently include a license file. Usage and redistribution permissions have therefore not been specified.
