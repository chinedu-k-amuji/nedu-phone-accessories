function recommendAccessory(phoneModel) {
  let products = JSON.parse(localStorage.getItem("products"));
  return products.filter(p => p.compatibility === phoneModel);
}

// Example usage
console.log(recommendAccessory("iPhone 13"));