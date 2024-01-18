
export async function get_suggestions(text:string, lang = "auto") {

    let url = "https://languagetool.org/api/v2/check";
    let data_obj = {
        "text": text,
        "language": lang,
    }

    let options = {
        method: 'POST',
        body: new URLSearchParams(data_obj),
    }

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        return console.log(error);
    }

}