export const priceFormat = (price: number) => {
    return new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "inr"
    }).format(price)
}