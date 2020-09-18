class PagoCuentaFija {
    constructor(id, idCuentaFija, value, increment, date, updateDate) {
        this.id = id,
            this.idCuentaFija = idCuentaFija,
            this.value = value,
            this.increment = increment,
            this.date = date,
            this.updateDate = updateDate
    }

    create(db) {
        const newPagoCuentaFija = {
            idCuentaFija: this.idCuentaFija,
            value: parseFloat(this.value),
            increment: this.increment,
            date: this.date,
            updateDate: this.updateDate
        }
        return db.collection('PagosCuentasFijas').add(newPagoCuentaFija);

    }
}

module.exports = PagoCuentaFija;