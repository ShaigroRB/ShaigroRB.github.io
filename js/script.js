class Citation {
    constructor(text, author = "?", title = "") {
        this.text = text ;
        this.author = author ;
        this.title = title ;
    }

    getFormalised() {
        var _span = `<i>${this.author}</i></span>` ;
        if (this.title) {
            _span = `<span title="${this.title}">${_span}` ;
        }
        else {
            _span = `<span>${_span}` ;
        }
        return `“${this.text}” - ${_span}` ;
    }
}

citations = [
                new Citation("Hope for the best, plan for the worst.", "Lee Child"),
                new Citation("You don't have to be great to start, but you have to start to be great.", "Zig Ziglar"),
                new Citation("The best time to plant a tree is twenty five years ago. The second best time is now.", "Chinese proverb"),
                new Citation("Music discovered by accident has the most dopamine.", "Paul Oketch", "a truthful commenter on youtube"),
                new Citation("La moitié d'un ami, c'est la moitié d'un traitre.", "Victor Hugo"),
                new Citation("Ils ne faut pas prendre les gens pour des cons, mais il ne faut pas oublier qu'ils le sont.", "Les Inconnus"),
                new Citation("Never argue with an idiot. They will drag you down to their level and beat you with experience.", "Mark Twain"),
                new Citation("It's hard to win an argument with a smart person, but it's damn near impossible to win an argument with a stupid person.", "Bill Murray"),
                new Citation("Don't think about your errors or your failures, otherwise you will never do a thing.", "Bill Murray"),
                new Citation("Doing anything is better than nothing."),
                new Citation("A lie told once remains a lie but a lie told a thousand times becomes the truth", "Joseph Goebbels")
            ] ;
len_citations = citations.length ;

footer_citations = document.getElementById("footer-citations") ;
{
    rnd = Math.floor(Math.random() * len_citations) ;
    footer_citations.innerHTML = citations[rnd].getFormalised() ;
} ;
