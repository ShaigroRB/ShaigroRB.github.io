citations = [
                "Hope for the best, plan for the worst. - Lee Child", 
                "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
                "The best time to plant a tree is twenty five years ago. The second best time is now.",
                "Music discovered by accident has the most dopamine. - Paul Oketch (a truthful commenter on youtube)",
                "La moitié d'un ami, c'est la moitié d'un traitre. - Victor Hugo"                
            ] ;
len_citations = citations.length ;

footer_citations = document.getElementById("footer-citations") ;
{
    rnd = Math.floor(Math.random() * len_citations) ;
    footer_citations.innerText = citations[rnd] ;
} ;
