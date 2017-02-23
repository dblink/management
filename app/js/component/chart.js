/**
 * Created by Administrator on 2017/2/9.
 */
  function pieChart(canvas, data){
    var r = [];
    for (var i in data){
      r.push({data: data[i], name: i});
    }
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    var color = ["#4CD990", "#FFCD01", "#1667A9", "#EA533F", "#A849AC"];
    ctx.arc(width / 2, height / 2, height / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    var sum = 0;
    r.map(function (line, key){
      let last = key === 0 ? 0 : r[key - 1].data ? r[key - 1].data.split("%")[0] * 3.6 : 0 ;
      sum = sum + last;
      let radian = line.data ? line.data.split("%")[0]*3.6 : 0 ;
      drawPie(radian);
      ctx.fillStyle = color[key] ;
      ctx.fill();

      function drawPie(radian){
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(Math.cos(sum * Math.PI / 180) * height / 2 + height / 2, Math.sin(sum * Math.PI / 180) * height / 2 + height / 2);
        ctx.arc(width / 2, height / 2, height / 2, sum * Math.PI / 180, (sum + radian) * Math.PI / 180);
        ctx.lineTo(width / 2, height / 2);
        ctx.closePath();
      }
    });
  }
  let chart = {
    pieChart: pieChart
  };
  export default chart