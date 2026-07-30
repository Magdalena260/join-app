import { Component, Input } from '@angular/core';

/**
 * Raw fallback blueprint matching the core database user or authenticated account record.
 */
interface User {
  id: number;
  firstname: string;
  lastname: string;
}

/**
 * Enriched user contract extending the core payload with computed visual interface properties.
 */
interface UIUser extends User {
  name: string;
  initials: string;
  avatarColor: string;
}

/**
 * Component managing the global user profile badge or avatar icon.
 * Dynamically evaluates character initials, maps persistent branding palettes,
 * and scales typography containers across multiple application layout anchors.
 */
@Component({
  selector: 'app-profile-icon',
  standalone: true,
  templateUrl: './profile-icon.html',
  styleUrls: ['./profile-icon.scss']
})
export class ProfileIcon {

  /**
   * Explicitly supplied character sequence for quick-rendering active or guest accounts.
   */
  @Input() public initials: string = '';

  /**
   * Explicitly supplied design token reference string determining the background color fill.
   */
  @Input() public avatarColor: string = '';

  /**
   * Optional comprehensive user object containing pre-calculated name, initial, and color metadata.
   */
  @Input() public user?: UIUser;

  /**
   * Layout scale descriptor defining the dimensional boundary conditions of the rendered avatar boundary.
   */
  @Input() public size: 'normal' | 'small' | 'big' | 'eighty' | 'header' = 'normal';

  /**
   * Static indexed catalog of available design-system palette variables mapped to unique records.
   */
  public availableColors: string[] = [
    'var(--clr-user-tangerine)',
    'var(--clr-user-flamingo)',
    'var(--clr-user-iris)',
    'var(--clr-user-amethyst)',
    'var(--clr-user-sky)',
    'var(--clr-user-mint)',
    'var(--clr-user-salmon)',
    'var(--clr-user-apricot)',
    'var(--clr-user-fuchsia)',
    'var(--clr-user-sunflower)',
    'var(--clr-user-cobalt)',
    'var(--clr-user-lime)',
    'var(--clr-user-lemon)',
    'var(--clr-user-cherry)',
    'var(--clr-user-marigold)'
  ];

  /**
   * Transforms raw database user fields into UI-ready parameters.
   * Maps individual identification keys to safe array ranges to ensure a deterministic color assignment.
   * Reserved for future implementation hooks or local mock pipeline data transformations.
   * 
   * @param {User} user - The baseline raw database or authentication record.
   * @returns {UIUser} An enriched data structure ready for interface rendering.
   * @private
   */
  private transformUserData(user: User): UIUser {
    const firstLetter = user.firstname?.charAt(0).toUpperCase() || '';
    const lastLetter = user.lastname?.charAt(0).toUpperCase() || '';
    const userId = typeof user.id === 'number' ? user.id : 0;
    const colorIndex = Math.abs(userId) % this.availableColors.length;

    return {
      ...user,
      name: `${user.firstname} ${user.lastname}`,
      initials: `${firstLetter}${lastLetter}`,
      avatarColor: this.availableColors[colorIndex],
    };
  }
}
