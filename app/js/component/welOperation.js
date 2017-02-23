/**
 * Created by Administrator on 2017/2/5.
 */

function closeModal(){
  this.setState({
    modalSwitch: "hidden"
  })
}
function openModal(){
  this.setState({
    modalSwitch: ""
  })
}
function getDate(day){
  this.setState({
    modalDate: day.target.getAttribute("data-value")
  })
}
const welOperation = {
  closeModal: closeModal,
  openModal: openModal,
  getDate: getDate
};
export default welOperation