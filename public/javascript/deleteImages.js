const imgs = document.querySelectorAll('.imgs');
const check = document.querySelectorAll('.select');
const select = document.querySelector('#select');
imgs.forEach((element,index)=>{
    element.addEventListener('click',()=>{
        const checkBox = document.querySelector(`#imgCheck-${index}`);
        if(!checkBox.checked ===true){
            checkBox.checked = true;
            element.style.border = '1px solid red';
            
        }else{
            checkBox.checked = false;
            element.style.border = '0px solid red';
        }
        let count = 0
        check.forEach((element,i)=>{
            if(element.checked){
                count++
            }
        })
        if(count >=1){
            const s = count>1?'s':'';
            select.textContent = `${count} item${s} to be deleted`;
        }else if(count<1){
            select.textContent ='select items to be deleted';
        }
    })
    count = 0;

});
