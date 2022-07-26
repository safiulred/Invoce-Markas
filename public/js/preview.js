var tmpData = []
var currentPage = 1
var rowsPerPage = 10
var no = 0

$(function () {
    $("#bntNext").click(function (e){
        e.preventDefault()
        currentPage+=1
        main()
    })

    $("#btnPrev").click(function (e){
        e.preventDefault()
        currentPage-=1
        main()
    })
})

function validatePaging(totalPages) {
    // console.log({totalPages, currentPage})
    if (currentPage > 1) {
        $('#btnPrev').attr('disabled', false)
        $('#btnPrev').attr('data-page', parseInt(currentPage-1))
    }
    else if (currentPage===1) {
        $('#btnPrev').attr('disabled', true)
        $('#btnPrev').attr('data-page', 1)
    }
    
    if (currentPage===parseInt(totalPages)) {
        $('#bntNext').attr('disabled', true)
    }
    else {
        $('#bntNext').attr('disabled', false)
        $('#bntNext').attr('data-page', parseInt(currentPage+1))
    }
}

function main () {
    const tgl_awal = $('#fTglAwal').val() || 'all'
    const tgl_akhir = $('#fTglAkhir').val() || 'all'
    const stsCustomer = $('#fStsCustomer').val();
    
    const dataToSend = {
        tgl_awal,
        tgl_akhir,
        currentPage,
        rowsPerPage,
        status: stsCustomer,
    }
    $.ajax({
        url : '/customer/list-preview',
        method: 'POST',
        header: {
            'Content-Type' : 'application/json'
        },
        data : dataToSend,
        beforeSend: function() {
            console.log('Loading...')
        },
        success : function (msg) {
            loadMessage(msg.output, msg.setting)
            const totalPages = msg.totalPages
            const totalData = msg.totalData
            validatePaging(totalPages)
        },
        error : function (xhr, ajaxOptions, thrownError) {
            $.smallBox({
                title : "Peringatan",
                content : `<i class='fa fa-clock-o'></i>Internal Server Error<i></i>`,
                color : "#C46A69",
                iconSmall : "fa fa-times  fa-1x fadeInRight animated",
                timeout : 1000
            });
        },
    })
}

function loadMessage (data, setting) {
    $('#contentView').html('')
    let indukElement = $("<div/>")
    data.map((r, idx)=>{
        let grid = $('<div/>',{
            style : 'margin-left : 5px; margin-right : 5px; margin-bottom : 10px;'
        })

        let row1 = $('<div/>',{
            style : 'padding: 10px; display: flex; flex-wrap: wrap; margin-right: 25px; margin-left: -15px;'
        })
        let row2 = $('<div/>',{
            style : 'margin-bottom : 50px;'
        })

        // CONTENT LEFT
        let contentLeft = $('<div/>',{
            style : 'flex : 1; margin-right :20px;'
        })
        if (setting&&setting.logo) {
            const logo = `/uploads/${setting.logo}`
            const contentImg = $('<img/>',{
                style : "object-fit : cover; height: 30px; margin-top : 13px;",
                src : logo
            })

            contentImg.appendTo(contentLeft)
        }

        let contentLeftTop = $('<div/>',{
            style : "display: flex; align-item: center;"
        })

        let contentFlex = $('<div/>',{
            style : "flex : 1;"
        })
        let contentFlex2 = $('<div/>',{
            style : "flex : 1;"
        })

        let tableLeftTop = $('<table/>',{
            style : "width: 80%;"
        })
        let trTableLeftTop = $("<tr style = 'padding : 10px;'>")
        let tdNoLeftTop = $("<td/>",{
            style : 'width:5%;',
            text : 'NO'
        })
        let tdSeperator = $("<td/>",{
            style : 'width:1%;',
            text : ':'
        })
        let tdValNoLeftTop = $("<td />",{
            style : "border-bottom:1px solid #000",
            width : "10%",
            class : 'text',
            text : no+1
        })
        tdNoLeftTop.appendTo(trTableLeftTop)
        tdSeperator.appendTo(trTableLeftTop)
        tdValNoLeftTop.appendTo(trTableLeftTop)
        trTableLeftTop.appendTo(tableLeftTop)
        tableLeftTop.appendTo(contentFlex)

        contentFlex2.appendTo(contentLeftTop)
        contentFlex.appendTo(contentLeftTop)

        contentLeftTop.appendTo(contentLeft)

        let seperatorLeft = $('<b/>',{
            style : "text-decoration : underline; font-weight: bold;",
            class : 'text',
            text : 'NOTA'
        })
        seperatorLeft.appendTo(contentLeft)

        let tableLeftBottom = $('<table/>',{
            style : "width: 90%;"
        })
        let tbodyLeftBottom = $('<tbody/>')

        // ROW NAMA
        let trLeftBottom1 = $('<tr/>',{
            style : "padding : 10px;"
        })
        let tdLabelLeftBottom1 = $('<td/>',{
            style : "font-weight: bold; font-size : 11px;",
            class : "text",
            width : "5%",
            text : 'NAMA'
        })
        let tdValueLeftBottom1 = $('<td/>',{
            style : "border-bottom:1px solid #000; font-weight: bold; font-size : 11px;",
            class : "text",
            width : "10%",
            text : r.nama.toUpperCase()
        })
        tdLabelLeftBottom1.appendTo(trLeftBottom1)
        $("<td style = 'width:1%'>:</td>").appendTo(trLeftBottom1)
        tdValueLeftBottom1.appendTo(trLeftBottom1)
        trLeftBottom1.appendTo(tbodyLeftBottom)
        // ROW TANGGAL
        let trLeftBottom2 = $('<tr/>',{
            style : "padding : 10px;"
        })
        let tdLabelLeftBottom2 = $('<td/>',{
            style : "font-weight: bold; font-size : 11px;",
            class : "text",
            width : "5%",
            text : 'TGL'
        })
        let tdValueLeftBottom2 = $('<td/>',{
            style : "border-bottom:1px solid #000; font-weight: bold; font-size : 11px;",
            class : "text",
            width : "10%",
            text : r.billing_date
        })
        tdLabelLeftBottom2.appendTo(trLeftBottom2)
        $("<td style = 'width:1%'>:</td>").appendTo(trLeftBottom2)
        tdValueLeftBottom2.appendTo(trLeftBottom2)
        trLeftBottom2.appendTo(tbodyLeftBottom)
        // ROW BULAN
        let trLeftBottom3 = $('<tr/>',{
            style : "padding : 10px;"
        })
        let tdLabelLeftBottom3 = $('<td/>',{
            style : "font-weight: bold; font-size : 11px;",
            class : "text",
            width : "5%",
            text : 'BULAN'
        })
        let tdValueLeftBottom3 = $('<td/>',{
            style : "border-bottom:1px solid #000; font-weight: bold; font-size : 11px;",
            class : "text",
            width : "10%",
            text : r.periode
        })
        tdLabelLeftBottom3.appendTo(trLeftBottom3)
        $("<td style = 'width:1%'>:</td>").appendTo(trLeftBottom3)
        tdValueLeftBottom3.appendTo(trLeftBottom3)
        trLeftBottom3.appendTo(tbodyLeftBottom)
        // ROW TOTAL
        let trLeftBottom4 = $('<tr/>',{
            style : "padding : 10px;"
        })
        let tdLabelLeftBottom4 = $('<td/>',{
            style : "font-weight: bold; font-size : 11px;",
            class : "text",
            width : "5%",
            text : 'TOTAL'
        })
        let tdValueLeftBottom4 = $('<td/>',{
            style : "border-bottom:1px solid #000; font-weight: bold; font-size : 11px;",
            class : "text",
            width : "10%",
            text : r.tagihan
        })
        tdLabelLeftBottom4.appendTo(trLeftBottom4)
        $("<td style = 'width:1%'>:</td>").appendTo(trLeftBottom4)
        tdValueLeftBottom4.appendTo(trLeftBottom4)
        trLeftBottom4.appendTo(tbodyLeftBottom)

        tbodyLeftBottom.appendTo(tableLeftBottom)
        tableLeftBottom.appendTo(contentLeft)

        contentLeft.appendTo(row1)

        // CONTENT RIGHT
        let contentRight = $('<div/>',{
            style : 'flex : 2; margin-left: 40px;'
        })

        if (setting&&setting.logo) {
            const logo = `/uploads/${setting.logo}`
            const contentImg = $('<img/>',{
                style : "object-fit : cover; height: 30px; margin-top : 13px;",
                src : logo
            })

            contentImg.appendTo(contentRight)
        }
        let rowContentRight = $('<div/>',{
            style : "display : flex; flex-wrap: wrap; margin-top : 10px;"
        })
        // CONTENT RIGHT OF LEFT BOX
        let contentRightBoxLeft = $('<div/>',{
            style : "flex : 1;"
        })
        $("<b class='text' style ='text-decoration : underline; font-weight: bold;' >NOTA</b>").appendTo(contentRightBoxLeft)
        let divBoxLeft = $('<div/>',{
            style : "display:flex; margin-top : 10px;"
        })
        let boxTableRight = $('<table/>',{
            style : "width: 100%;"
        })
        let boxTbodyRight = $('<tbody/>')
        // ROW LAYANAN
        let boxTrRight1 = $('<tr/>',{
            style : "padding : 10px;"
        })
        let boxTdLabelRight1 = $('<td/>',{
            style : "font-weight: bold; font-size : 11px;",
            class : 'text',
            width : '15%',
            text : 'Layanan Internet Periode'
        })
        let boxTdValueRight1 = $('<td/>',{
            style : "border-bottom:1px solid #000; font-weight: bold; font-size : 11px;",
            class : 'text',
            width : '15%',
            text : r.periode
        })
        boxTdLabelRight1.appendTo(boxTrRight1)
        $("<td style = 'width:1%'>:</td>").appendTo(boxTrRight1)
        boxTdValueRight1.appendTo(boxTrRight1)
        boxTrRight1.appendTo(boxTbodyRight)
        // ROW TOTAL
        let boxTrRight2 = $('<tr/>',{
            style : "padding : 10px;"
        })
        let boxTdLabelRight2 = $('<td/>',{
            style : "font-weight: bold; font-size : 11px;",
            class : 'text',
            width : '15%',
            text : 'Total'
        })
        let boxTdValueRight2 = $('<td/>',{
            style : "border-bottom:1px solid #000; font-weight: bold; font-size : 11px;",
            class : 'text',
            width : '15%',
            text : r.tagihan
        })
        boxTdLabelRight2.appendTo(boxTrRight2)
        $("<td style = 'width:1%'>:</td>").appendTo(boxTrRight2)
        boxTdValueRight2.appendTo(boxTrRight2)
        boxTrRight2.appendTo(boxTbodyRight)


        boxTbodyRight.appendTo(boxTableRight)
        boxTableRight.appendTo(divBoxLeft)
        divBoxLeft.appendTo(contentRightBoxLeft)
        contentRightBoxLeft.appendTo(rowContentRight)
        // END
        // CONTENT RIGHT OF RIGHT BOX
        let contentRightBoxRight = $('<div/>',{
            style : "flex : 1; margin-left : 10px;"
        })
        let divBoxRight = $('<div/>',{
            style : "padding : 10px; border : 2px solid #000;"
        })
        // ROW KEPADA
        let rowBoxRight1 = $('<div/>',{
            style : "display : flex; align-item : center;"
        })
        let captionBoxRight1 = $('<div/>',{
            style : "border-bottom : 1px solid #000; width : 100%; flex : 4; font-size : 15px;",
            text : r.nama.toUpperCase()
        })
        $("<b style = 'flex:3' class='text-box'>Kepada</b>").appendTo(rowBoxRight1)
        captionBoxRight1.appendTo(rowBoxRight1)
        rowBoxRight1.appendTo(divBoxRight)
        // ROW ALAMAT
        let rowBoxRight2 = $('<div/>',{
            style : "display : flex; align-item : center;"
        })
        let captionBoxRight2 = $('<div/>',{
            style : "border-bottom : 1px solid #000; width : 100%; flex : 4; font-size : 15px;",
            text : r.alamat
        })
        $("<b style = 'flex:3' class='text-box'>Alamat</b>").appendTo(rowBoxRight2)
        captionBoxRight2.appendTo(rowBoxRight2)
        rowBoxRight2.appendTo(divBoxRight)
        // ROW TGL
        let rowBoxRight3 = $('<div/>',{
            style : "display : flex; align-item : center;"
        })
        let captionBoxRight3 = $('<div/>',{
            style : "border-bottom : 1px solid #000; width : 100%; flex : 4; font-size : 15px;",
            text : r.billing_date
        })
        $("<b style = 'flex:3' class='text-box'>Tgl</b>").appendTo(rowBoxRight3)
        captionBoxRight3.appendTo(rowBoxRight3)
        rowBoxRight3.appendTo(divBoxRight)

        divBoxRight.appendTo(contentRightBoxRight)
        contentRightBoxRight.appendTo(rowContentRight)
        // END

        rowContentRight.appendTo(contentRight)
        contentRight.appendTo(row1)

        row1.appendTo(grid)
        row2.appendTo(grid)
        $('#contentView').append(grid)

        no +=1
    })
}

main()