var json=  { Items:
      [ { passpercentage: '60',
            id: '1010',
            harness: 'regression',
            date: '1464835242969' },
        { passpercentage: '81',
            id: '5e1b56bc-de62-4f78-8a24-58e221d4c75a',
            harness: 'regression',
            date: '1464435242969' },
        { passpercentage: '40',
            id: '1002',
            harness: 'regression',
            date: '1462335242969' },
        { passpercentage: '89',
            id: '1018',
            harness: 'regression',
            date: '1464835242968' },
        { passpercentage: '80',
            id: '1001',
            harness: 'regression',
            date: '1464835242967' },
        { passpercentage: '81',
            id: '1061',
            harness: 'regression',
            date: '1464835242966' },
        { passpercentage: '30',
            id: '1017',
            harness: 'regression',
            date: '1464835242965' },
        { passpercentage: '20',
            id: '1005',
            harness: 'regression',
            date: '1464835242964' },
        { passpercentage: '23',
            id: '1030',
            harness: 'regression',
            date: '1464835242963' },
        { passpercentage: '81',
            id: '1065',
            harness: 'regression',
            date: '1464835242961' } ],
    Count: 10,
    ScannedCount: 10 }


//console.log(json);
//var obj = JSON.parse(json);
var count = json.Items.length;
var items = json.Items;
var date = json.Items[count -1].date;

console.log(date);

