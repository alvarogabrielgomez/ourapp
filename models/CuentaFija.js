class CuentaFija {
    constructor(id, name, description, value, increment, dayOfPayment, date, updateDate) {
        this.id = id,
            this.name = name,
            this.description = description,
            this.value = value,
            this.increment = increment,
            this.dayOfPayment = dayOfPayment,
            this.date = date,
            this.updateDate = updateDate
    }

    create(db) {
        const newCuentaFija = {
            name: this.name,
            description: this.description,
            value: parseFloat(this.value),
            increment: this.increment,
            dayOfPayment: this.dayOfPayment,
            date: this.date,
            updateDate: this.updateDate,
        }
        if (this.id && this.id != "") newCuentaFija.id = this.id;

        return db.collection('CuentasFijas').add(newCuentaFija);
    }

    fetchAll(db) {}

    static fetch(db, id) {
        var query = db.collection('CuentasFijas').doc(id);
        return query.get();
    }

}

module.exports = CuentaFija;