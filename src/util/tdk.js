class tdk {
    static async find(dataType, query) {
            const request = await fetch(`http://sozluk.gov.tr/${dataType}?ara=${encodeURI(query)}`);
            const data = await request.json();
            if(data.error == "Sonuç bulunamadı") return null
            return data;
    }
}

export default tdk;
