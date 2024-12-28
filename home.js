const vehicleOne = {
    brand: 'Ford',
    model: 'Mustang',
    type: 'car',
    year: 2021,
    color: 'red'
}
function countBy({ brand, year }) {
    console.log(brand);
    console.log(year);
}

countBy(vehicleOne);

