// Button status
// Form search
// checkBox get id and past input to change multi or single product status
//pagination 





// Button status
    const buttonStatus = document.querySelectorAll("[button-status");
    if(buttonStatus.length > 0) {
        let url = new URL(window.location.href);

        buttonStatus.forEach((button) => {
            button.addEventListener("click", (event) => {
                url.searchParams.delete("page");
                const status = button.getAttribute("button-status");
                if(status) {
                    url.searchParams.set("status", status);
                } else {
                    url.searchParams.delete("status");
                }
                window.location.href = url.href;
            });
        });
    };















// Form search
    const formSearch = document.querySelector("#form-search");
    if(formSearch) {
        formSearch.addEventListener("submit", (event) => {
            event.preventDefault();
            let url = new URL(window.location.href);
            url.searchParams.delete("page");
            const keyword = event.target.elements.keyword.value;
            if(keyword) {
                url.searchParams.set("keyword", keyword);
            } else {
                url.searchParams.delete("keyword");
            }
            window.location.href = url.href;
            // console.log();
        });
    };

















// querySelector anyThing to handle
    const checkboxMulti = document.querySelector(".checkbox-multi");
    const checkboxAll = checkboxMulti.querySelector("input[name='checkall']");
    const checkboxSingle = checkboxMulti.querySelectorAll("input[name='id']");
    const idProducts = document.querySelector("[list-id-products]"); // input field id of products
    const positionAll = checkboxMulti.querySelectorAll('input[name="position"]');
//----------------------------------------------------------------- FUNCTIONS -----------------------------------------------------
    function checkedAfterLoad (checkbox) { // checkbox and POSITION
        const indexIdCheckbox = idProducts.value.indexOf(checkbox.value);
        if(indexIdCheckbox !== -1) {
            let position = checkbox.closest("tr").querySelector('input[name="position"]');
            const startPosition = idProducts.value.indexOf('.', indexIdCheckbox) + 1;
            const endPosition = idProducts.value.indexOf(' ', indexIdCheckbox);
            position.value = parseInt(idProducts.value.substring(startPosition, endPosition));
            checkbox.checked = true;
        } else checkbox.checked = false;

    }

    function isCheckedAll() {
        const numberBoxChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        if(numberBoxChecked.length == checkboxSingle.length) checkboxAll.checked = true;
        else checkboxAll.checked = false;
    }

    const checked = (checkbox) => {
        checkbox.checked = true;
        //populate and delete if stick/no on input field
        const position = checkbox.closest("tr").querySelector('input[name="position"]');
        // id: fasdlj3l24.23 - 
        const idAtCheckbox = checkbox.value + '.' + position.value + ' - ';
        idProducts.value = idProducts.value + idAtCheckbox;
        // console.log(idProducts.value);
        isCheckedAll();
    }

    const unChecked = (checkbox) => {
        checkbox.checked = false;
        //populate and delete if stick/no on input field
        const position = checkbox.closest("tr").querySelector('input[name="position"]');
        // replace by ""
        let newString = idProducts.value;
        const indexStart = newString.indexOf(checkbox.value);
        const indexEnd = newString.indexOf('-', indexStart) + 2;
        if(indexStart !== -1) newString = newString.replace(newString.substring(indexStart, indexEnd), "");
        idProducts.value = newString;
        isCheckedAll();
    }

    function checkOrUncheck(checkbox) {
        checkbox.addEventListener("click",(e) => {
            if(checkbox.checked) checked(checkbox); else unChecked(checkbox);
            // check all at per pag
            isCheckedAll();
        });
    };
//-----------------------------------------------------------------END FUNCTIONS-----------------------------------------------------
    //SINGLE CHECK --(click check for per box)
        if(checkboxSingle.length > 0) {
            checkboxSingle.forEach((checkbox) => {
                
                // check has checked on input field and stick on checkbox
                checkedAfterLoad(checkbox);
                checkOrUncheck(checkbox);
 
            });
            // check all at per pag
            isCheckedAll();
        };
    // CLICK on input 'CHECK ALL' --(click and checked all)
        if(checkboxAll) {
            checkboxAll.addEventListener("click" , e => {
                checkboxSingle.forEach((checkbox) => {
                    
                    const position = checkbox.closest("tr").querySelector('input[name="position"]');
                    const idAtCheckbox = checkbox.value + '.' + position.value + ' - ';
                    
                    if(checkboxAll.checked) {
                        checkbox.checked = true;
                        idProducts.value = idProducts.value + idAtCheckbox;
                        // checked(checkbox);
                    }
                    else {
                        checkbox.checked = false;
                        idProducts.value = idProducts.value.replace(idAtCheckbox, "");
                    };
                });
                
            });
        };

    // POSITION INPUT
    if(positionAll.length) {
        positionAll.forEach((position, index) => {
            const positionChange = document.querySelector(`#select-change-status option[value="change-position"]`);
            position.addEventListener("input", e => {
                // console.log(positionChange);
                positionChange.selected = true;
                unChecked(checkboxSingle[index]);
                checked(checkboxSingle[index]);
            });
        });
    };

    //BUTTON SUBMIT FORM
    const formChangeMulti = document.querySelector("[form-change-multi]")
    if(formChangeMulti)
        formChangeMulti.addEventListener("submit", e => {
            e.preventDefault();
            const typeChange = e.target.elements.type.value;

            let confirmChange = false;
            const arrayReq = ["--Choose Action--", "active", "inactive", "restore", "delete", "change-position", "hard-delete"];
            const arrayAct = [
                `MÀY LÀ GAY ĐÚNG HÔK ???`,
                () => confirm("Are you sure to change ACTIVE status of products ?"),
                () => confirm("Are you sure to change INACTIVE status of products ?"),
                () => confirm("Are you sure to change RESTORE status of products ?"),
                () => confirm("Are you sure to change DELETE status of products ?"),
                () => confirm("Are you sure to change POSITION of products ?"),
                () => confirm("Are you sure to HARD DELETE (FOREVER) of products ?")
            ]
            const indexOfReq = arrayReq.indexOf(typeChange);
            if (indexOfReq > 0) confirmChange = arrayAct[indexOfReq]();
            else {
                alert("Please select option to apply changging !");
                return;
            }
            
            if (confirmChange) formChangeMulti.submit();
        });

    // BUTTON CLEAR LIST_UNPUT_ID FORM
    const clearButton = document.querySelector("[clear-list-id");
    if(clearButton)
        clearButton.addEventListener("click", (e) => {
            let url = new URL(window.location.href);
            url.searchParams.delete("list_id_change_status");
            url.searchParams.delete("keyword");
            window.location.href = url.href;
        }
    );

    
    
    





    


//pagination 
    const btn_pagination = document.querySelectorAll("[button-pagination]");
    if(btn_pagination) {
        btn_pagination.forEach( button => {
            button.addEventListener("click", (event) => {
                let url = new URL(window.location.href);
                const page = button.getAttribute("button-pagination");
                if(page) {
                    url.searchParams.set("page", page);
                } else {
                    url.searchParams.delete("page");
                }
                // pagination and get checkedbox
                if (idProducts.value != "") url.searchParams.set("list_id_change_status", idProducts.value);
                else url.searchParams.delete("list_id_change_status");
                window.location.href = url.href;
            });
        });
    }

    const inputPagination = document.querySelector(".input-pagination");
    if(inputPagination) {
        inputPagination.addEventListener("change", (e) => {
            let url = new URL(window.location.href);
            const input = inputPagination.querySelector("input");
            url.searchParams.set("page",input.value >= 1 ? input.value : 1);
            window.location.href = url.href;
        })
    }
// end pagination






// NAVIGATE TO EDIT PRODUCT PAGE
const buttonEdit = document.querySelectorAll("[button-edit]");
let form_edit_item = document.querySelector("#edit-item-page");
if(buttonEdit) {
    buttonEdit.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const path = form_edit_item.getAttribute("data-path");
            const id = button.getAttribute("data-id");
            const action = path + `/${id}?_method=GET`;
            form_edit_item.action = action;
            form_edit_item.submit();
        })
    })
}


// sort key
const sortSelect = document.querySelector("[sort-select]");
if(sortSelect) {
    let url = new URL(window.location.href);
    sortSelect.addEventListener("change", () => {
        const sortKey = sortSelect.value;
        url.searchParams.set("sortCriteria", sortKey);
        window.location.href = url.href;
    })
    const sortKey = url.searchParams.get("sortCriteria");
    if(sortKey) {
        let sortOption = sortSelect.querySelector(`option[value='${sortKey}']`);
        sortOption.selected = true;
    }
}

