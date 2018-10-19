<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
   Sessions allow user authentication data to persist across requests. A user can provide credentials once (per device) and then make further requests without having to resubmit those credentials until they expire.

2) What does bcrypt do to help us store passwords in a secure manner.
   bcrypt hashes passwords so the server doesn't store them in plaintext. This means only the user knows the unhashed password and it has to be compared to the hash on the server every time they log in.

3. What does bcrypt do to slow down attackers?
   bcrypt spends a significant amount of cpu power hashing each password so that brute force attacks become infeasible due to computational requirements.

4) What are the three parts of the JSON Web Token?
   header: type of token and hash algorithm
   payload: user info and claims
   signature: created from header, payload, and secret
