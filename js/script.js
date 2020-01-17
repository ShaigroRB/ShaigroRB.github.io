class Citation {
    constructor(text, author, title = "") {
        this.text = text ;
        this.author = author ;
        this.title = title ;
    }

    getFormalised() {
        var _span = `<i>${this.author}</i></span>` ;
        if (this.title) {
            _span = `<span title="${this.title}>${_span}` ;
        }
        else {
            _span = `<span>${_span}` ;
        }
        return `"${this.text}" - ${_span}` ;
    }
}

citations = [
                new Citation("Hope for the best, plan for the worst.", "Lee Child")                
            ] ;
len_citations = citations.length ;

footer_citations = document.getElementById("footer-citations") ;
{
    rnd = Math.floor(Math.random() * len_citations) ;
    footer_citations.innerHTML = citations[rnd].getFormalised() ;
} ;
