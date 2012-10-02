package au.org.emii.portal

/**
 * Types of filters a layer can take.
 *
 * To add a new type:
 *
 * 1) Make a new value for the filtertype enumeration.  Note that all possible values are stored
 * as strings in the database.
 * 2) Create an appropriate type in the Javascript, i.e., in web-app/js/portal/filter
 */
public enum FilterTypes {
    STRINGTYPE, DATETYPE, NUMTYPE, BOOLTYPE

    @Override
    String toString(){
        switch(this){
            case STRINGTYPE: return "String"
                break
            case DATETYPE: return "Date"
                break
            case NUMTYPE: return "Number"
                break
            case BOOLTYPE: return "Boolean"
        }

        // Code review - PM: If you decide not to change the implementation (see below)
        // then I would throw an Exception here to quickly identify an
        // unhandled Enum value. Currently this returns null if an Enum
        // is not handled (ie. if someone creates a new one but doesn't update
        // the switch statement)
    }

    String getKey() { name() }
}

// Code review - PM: I think that given how we use this enum it could be made a bit more simple.
/*
Currenty there is room for people adding new ones to make a mistake (not update the switch statement) and
silently introduce a bug. There are 2 ways you could rewrite this enum which would not have this problem.

Option 1: Just rename the enums (my preferred option but it might not fit in with your preferred naming convention)

public enum FilterTypes {
    String, Date, Number, Boolean

    String getKey() { name() }
}

Option 2: Define the enums with a constructor that takes an argument

public enum FilterTypes {
    STRINGTYPE("String"),
    DATETYPE("Date"),
    NUMTYPE("Number"),
    BOOLTYPE("Boolean")

    def stringRepresentation

    FilterTypes( s ) {
        stringRepresentation = s
    }

    @Override
    String toString(){
        return stringRepresentation
    }

    String getKey() { name() }
}

 */