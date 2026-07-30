/**
 * Structural contract defining the data payload and property boundaries for a contact entity
 * within the global application registry and relational database bindings.
 */
export interface Contact {
  /**
   * Optional unique relational identifier mapped to the backend database index.
   * Evaluates to undefined prior to successful network persistence.
   */
  id?: number;

  /**
   * String literal payload caching the designated primary given name of the entity.
   */
  firstname: string;

  /**
   * String literal payload caching the designated secondary family name of the entity.
   */
  lastname: string;

  /**
   * String literal payload containing the sanitized numerical telephonic routing sequence.
   */
  telephone: string;

  /**
   * String literal payload storing the validated electronic mail address utilized for primary digital correspondence.
   */
  email: string;
}
