fbsA.gDt('sj-log', '', (d, e) => {
    if (e) {
        console.error(e);
        return;
    }

    const result = d
        ? Object.entries(d)
            .filter(([key, val]) => val.mkt === 'App Admin') // filter berdasarkan isi 'mkt'
            .map(([key, val]) => ({ key, ...val }))           // ambil key + spread datanya
        : [];
    return _.reduce(result,(v,k)=>{
        fbsA.delDt(`sj-log/${k.key}`,()=>{})
    })
    // return _.pick(result,'key');
});
