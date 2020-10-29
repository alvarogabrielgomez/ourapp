class CuentaFija {
    constructor(db) {
        this.db = db;
    }

    create(newCuentaFija) {
        return this.db.collection('CuentasFijas').doc()
            .set(newCuentaFija)
    }

    fetchAll() {
        let query = this.db.collection('CuentasFijas')
            .orderBy('date', 'desc');
        return query.get();
    }
    fetchItem(item_id) {
        return this.db.collection('CuentasFijas').doc(item_id).get();
    }

    delete(item_id) {
        const document = this.db.collection('CuentasFijas').doc(item_id);
        return document.delete();
    }

    update(item_id, putCuentaFija) {
        const document = db.collection('CuentasFijas').doc(putCuentaFija.id);
        return document.update(putCuentaFija);
    }

    async getIncrementValueOfCuentasFijas(idCuentaFija, actualValue) {
        var incrementValue = {
            sign: "",
            value: 0
        };
        try {
            const document = db.collection('CuentasFijas').doc(idCuentaFija);
    
            var response = await document.get();
            var lastValue = 0.00;
    
            lastValue = parseFloat(parseFloat(response.data().value).toFixed(2));
    
            var diffValue = parseFloat(parseFloat(parseFloat(actualValue.toFixed(2)) - lastValue).toFixed(2));
            var signValue = Math.sign(diffValue) == 0 ? "zero" : Math.sign(diffValue) > 0 ? "positive" : "negative";
            incrementValue.sign = signValue;
            incrementValue.value = Math.abs(diffValue);
    
            return incrementValue;
        } catch (error) {
            console.log("Error getIncrementValueOfCuentasFijas", error);
            return incrementValue;
        }
    }

}

module.exports = CuentaFija;