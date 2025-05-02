fbsA.gDt('sj-log/-OOuxs036EEXDL2G8Bbb','',(data,error)=>{
    console.log(data);
})

fbsA.upd('sj-log/-OOuS1HXccggcH2lOYnE', null, { done: 3 }, () => {
    console.log('Update done berhasil!');
}); 

function getModifiedData() {
    return new Promise((resolve, reject) => {
        fbsA.gDt('sj-log/-OOuS1HXccggcH2lOYnE', '', (data, e) => {
            if (e) {
                reject(e);
                return;
            }
            
            const modifiedData = {
                ...data,
                dt_m: stm(),
                idStock: "45347",
                ky: 0,
                ltrl: "49#7",
                q: "94.00",
                rkkl: "307 B",
                timestamp: Date.now(), // pakai Date.now() JS
                change_pic: "WH Pic"   // tambahan properti
            };

            resolve(modifiedData);
        });
    });
}

fbsA.gDt('sj-log/-OOuS1HXccggcH2lOYnE','',(data,d)=>{
    getModifiedData().then((data) => {
        console.log(data);
    }).catch((err) => {
        console.error('Error:', err);
    });
})

{
    "id_kain": 624,
    "id_rtr": "?",
        "id_stock": 42932,
        "kol": "B",
        "lot": "49",
        "q": "25.30",
        "rak": "300",
        "rol": 1,
    "stts": "g"
}



// Fungsi bantu untuk memproses data searchId
function pickSelectedFields(obj) {
    const picked = _.pick(obj, ['id_stock', 'kol', 'lot', 'q', 'rak', 'rol']);
    return {
        idStock: String(picked.id_stock),
        ltrl: `${picked.lot}#${picked.rol}`,
        q: picked.q,
        rkkl: `${picked.rak} ${picked.kol}`
    };
}

function getModifiedData() {
    return new Promise((resolve, reject) => {
        fbsA.gDt('sj-log/-OOuS1HXccggcH2lOYnE', '', (data, e) => {
            if (e) {
                reject(e);
                return;
            }
            
            // Misal dapatkan dari dataLayer2 dan id tertentu
            const searchResult = searchId(dataLayer2, 42932)[0]; // Ganti 42932 sesuai kebutuhan
            const pickedData = pickSelectedFields(searchResult);

            const modifiedData = {
                ...data,
                dt_m: stm(),
                idStock: pickedData.idStock,
                ky: 0,
                ltrl: pickedData.ltrl,
                q: pickedData.q,
                rkkl: pickedData.rkkl,
                timestamp: Date.now(),
                change_pic: "WH Pic"
            };

            resolve(modifiedData);
        });
    });
}