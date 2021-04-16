module.exports = async (req, res, next) => {
  /** Create convenient local variable for our strapped page */
  const p = req.page;
  
  /** Create a new row and auto-sized column with size 2 header */
  p.row();
  p.col();
  p.h2().color(`primary`).text(`Load User`).addClass(`pb-2`);
  
  /** Create new row and auto-sized column with load user form and create button */
  p.row();
  p.col();
  p.form().action(`/load/user`).method(`GET`).inline(true);
  p.input().id(`id`).name(`id`).type(`text`).placeholder(`ID #`);
  p.button(`form`).addClass(`mx-2`).color(`primary`).type(`submit`).text(`Load`);
  p.button(`form`).color(`secondary`).type(`button`).id(`createButton`).text(`Create Users`);
  
  /** Try to... */
  try {
    /** If an ID was provided... */
    if ( req.data.id ) {
      /** Create new user */
      const user = new req.models.User();

      /** Attempt to load by ID (converted from string to integer) */
      const exists = await user.load(parseInt(req.data.id), req.db);

      /** If user doesn't exist, throw strapped error */
      if ( !exists )
        throw new req.StrappedError().cols(4).color(`danger`).strong(`Not Found!`).text(`No user exists with that ID #.`);

      /** Create some descriptive text about the user */
      let description = `${user.fullName()} will have ${req.constants.sexPronouns[user.sex()]} ${req.numeral(user.age() + 1).format(`0o`)} birthday sometime in the next year`;

      description += ` and has a bank account balance of ${req.numeral(user.balance()).format(`$0.00`)}.`;
      description += `  This information is up to date as of ${req.moment().tz(`America/Chicago`).format(`DD-MMM-Y`)}.`

      /** Create a new row and size 4 column with the description */
      p.row();
      p.col().size(4).text(description);
    }
    
    /** If the variable 'create' was provided... */
    else if ( req.data.create ) {
      /** Create new user */
      const user = new req.models.User();
      
      /** Set example user properties */
      user.age(38);
      user.balance(12.47);
      user.firstName(`Rich`);
      user.lastName(`Lowe`);
      user.sex(req.constants.sexes.MALE);
      
      /** Insert user into database */
      await user.insert(req.db);
      
      console.log(`User ID# ${user.id()} - ${user.fullName()} has been created.`);
      
      /** Redirect to success message */
      res.redirect(`/load/user?created=1`);
    }
    
    /** If the variable 'created' was provided, throw success message as strapped error */
    else if ( req.data.created ) {
      throw new req.StrappedError().cols(4).color(`success`).strong(`Success!`).text(`Example user created!`);
    }
  } 
  
  /** Catch any error that occurred, and output as strapped alert box */
  catch ( err ) {
    p.alertFromError(err);
  }
  
  /** Add client-side JavaScript for handling the clicking of the create button */
  p.script().append(() => {
    /** When create button is clicked... */
    $( `#createButton` ).click(() => {
      /** Disable create button (to prevent double submission) */
      $( `#createButton` ).prop(`disabled`, true);
      
      /** Redirect to this page with URL encoded variable create set equal to one */
      location = `?create=1`;
    });
  });
  
  /** Call the next express route */
  next();
};
