// Addition of Products, Articles, Cities, or Payment Mediums

products_add = _ => {
    let id_num = helpers.timestamp()

    firebase.database().ref('products').child(`${id_num}`).update({
        product_name: '',
        price: 0,
        description: ''
    })
}

articles_add = _ => {
    let id_num = helpers.timestamp()

    firebase.database().ref('articles').child(`${id_num}`).update({
        link: '',
        photo: '',
        title: '',
        written_by: ''
    })
}

province_add = _ => {
    let id_num = helpers.timestamp()

    firebase.database().ref('provinces').child(`${id_num}`).update({
        province_name: ''
    })
}

paymentMedium_add = _ => {
    let id_num = helpers.timestamp()

    firebase.database().ref('payment_mediums').child(`${id_num}`).update({
        payment_method: '',
        account_number: ''
    })
}