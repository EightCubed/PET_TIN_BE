const config = require("../locationData.json");

async function fetchLocationData(req, res) {
  try {
    const { country: countryId, state: stateId } = req.query;
    const Countries = config.map((countryData) => {
      return {
        countryId: countryData.id,
        countryName: countryData.name,
      };
    });

    let response;
    if (!countryId && !stateId) {
      response = Countries;
    } else if (!stateId) {
      const States = config.find(
        (country) => country.id === Number(countryId)
      ).states;
      response = States.map((state) => {
        return {
          stateId: state.id,
          stateName: state.name,
        };
      });
    } else {
      const States = config.find(
        (country) => country.id === Number(countryId)
      ).states;
      const Cities = States.find(
        (state) => state.id === Number(stateId)
      ).cities;
      response = Cities.map((city) => {
        return {
          stateId: city.id,
          stateName: city.name,
        };
      });
    }
    res.status(201).json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  fetchLocationData,
};
