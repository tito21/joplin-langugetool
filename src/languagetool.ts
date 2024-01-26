
export async function get_suggestions(text: string, LTOptions: any) {

    // console.log(LTOptions);
    let data_obj = {
        "text": text,
        "language": LTOptions.language,
    };
    if (LTOptions.API !== "") {
        data_obj["apiKey"] = LTOptions.API;
        data_obj["username"] = LTOptions.username;
    }

    let options = {
        method: 'POST',
        body: new URLSearchParams(data_obj),
    }

    try {
        const response = await fetch(LTOptions.url, options);
        return await response.json();
    } catch (error) {
        return console.log(error);
    }

}

export async function add_to_dictionary(word: string, LTOptions: any) {
    let data_obj = {
        apiKey: LTOptions.API,
        username: LTOptions.username,
        word: word
    }

    let options = {
        method: 'POST',
        body: new URLSearchParams(data_obj),
    }
    let url = LTOptions.url.split("check")[0] + "words/add";

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        return console.log(error);
    }


}