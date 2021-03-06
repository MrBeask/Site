'use strict';

const display_notifications = (messages, type, selector) => {
    let html = '';
    type = type == 'error' ? 'danger' : type;

    for(let message of messages) {

        html += `
            <div class="alert alert-${type} animate__animated animate__fadeIn">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                ${message}
            </div>`;

    }

    selector.innerHTML = html;
};

const fade_out_redirect = ({ url = false, selector = 'body', wait_time = 70, full = false }) => {

    /* Get the base url */
    let base_url = $('#url').val();

    /* Redirect link */
    let redirect_url = full ? url : `${base_url}${url}`;

    setTimeout(() => {
        $(selector).fadeOut(() => {
            $(selector).html('<div class="vw-100 vh-100 d-flex align-items-center"><div class="col-2 text-center mx-auto" style="width: 3rem; height: 3rem;"><div class="spinner-grow"></div></div></div>').show();
        });

        setTimeout(() => window.location.href = redirect_url, 100)
    }, wait_time)

};

const redirect = (path, is_full_url = false) => {
    window.location.href = is_full_url ? path : `${url}${path}`;
};

const ajax_call_helper = (event, controller, request_type, success_callback = () => {}) => {
    let row_id = $(event.currentTarget).data('row-id');

    let data = {
        global_token,
        request_type
    };

    switch(controller) {
        case 'project-ajax':
            data.project_id = row_id;
            break;

        case 'link-ajax':
            data.link_id = row_id;
            break;

        case 'biolink-block-ajax':
            data.biolink_block_id = row_id;
            break;

        default:
            data.id = row_id;
    }

    $.ajax({
        type: 'POST',
        url: controller,
        data: data,
        success: (data) => {
            if(data.status == 'error') {
                alert(data.message[0]);
            }

            else if(data.status == 'success') {

                success_callback(event, data);

            }
        },
        dataType: 'json'
    });

    event.preventDefault();
};

const number_format = (number, decimals, dec_point = '.', thousands_point = ',') => {

    if (number == null || !isFinite(number)) {
        throw new TypeError('number is not valid');
    }

    if(!decimals) {
        let len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace('.', dec_point);

    let splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
};

const nr = (number, decimals = 0) => {
    return number_format(number, decimals, decimal_point, thousands_separator);
};

const get_cookie = name => {
    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

    return v ? v[2] : null;
};

const set_cookie = (name, value, days, path) => {
    let d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);

    document.cookie = `${name}=${value};path=${path};expires=${d.toGMTString()}`;
};

const delete_cookie = (name, path) => {
    set_cookie(name, '', -1, path);
};

const get_slug = (string, delimiter = '-', lowercase = true) => {
    string = string.replace(/[^a-zA-Z0-9._-]+/g, delimiter);
    let regex = new RegExp(`${delimiter}+`, 'g');
    string = string.replace(regex, delimiter);
    string = string.trim();

    if(lowercase) {
        string.toLowerCase();
    }

    return string;
}

const update_this_value = (this_element, function_name) => {
    this_element.value = function_name(this_element.value);
}
