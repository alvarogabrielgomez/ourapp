class PagoCuentaFija {
    constructor(db) {
        this.db = db;
    }

    create(newPagoCuentaFija) {
        return this.db.collection('PagosCuentasFijas').doc()
            .set(newPagoCuentaFija)
    }

    fetch() {
        let query = this.db.collection('PagosCuentasFijas').orderBy('date', 'desc');
        return query.get();
    }

    fetchCurrentMonth() {
        let now = Date.now();
        now = new Date(now);
        let currentMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        let query = this.db.collection('PagosCuentasFijas')
            .where("date", ">", currentMonth)
            .orderBy('date', 'desc');
        return query.get();
    }
    fetchItem(item_id) {
        const document = this.db.collection('PagosCuentasFijas').doc(item_id);
        return document.get();
    }

    fetchItemWhereIDCuentaFija(idCuentaFija){
        const document = this.db.collection('PagosCuentasFijas').where("idCuentaFija", "==", idCuentaFija).orderBy('date', 'desc');
        return document.get();
    }

    delete(item_id) {
        const document = this.db.collection('PagosCuentasFijas').doc(item_id);
        return document.delete();
    }

    update(item_id, putCuentaFija) {
        const document = db.collection('PagosCuentasFijas').doc(item_id);
        return document.update(putCuentaFija);
    }

}

module.exports = PagoCuentaFija;