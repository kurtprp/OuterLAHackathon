export enum Category {
  BIRTHDAY = "Birthday",
  THANK_YOU = "Thank you",
  TESTIMONY = "Testimony",
  ANNIVERSARY = "Anniversary",
  BABY_SHOWER = "Baby Shower",
  //   WEDDING_AND_ENGAGEMENT = "Wedding and engagement",
  NEW_YEAR = "New Year",
  VALENTINES = "Valentines",
  MOTHERS_DAY = "Mother's Day",
  FATHERS_DAY = "Father's Day",
  GRADUATION = "Graduation",
  //   HALLOWEEN = "Halloween",
  THANKSGIVING = "Thanksgiving",
  CHRISTMAS = "Christmas",
  All = "All"
}

export const CategoryPlaceholderMessage: Record<Category, string> = {
  [Category.All]:
    "Congratulations on this momentous occasion! You're killing it like a boss and taking on life like a pro. You're a true inspiration to everyone around you. Keep up the good work!",
  [Category.BIRTHDAY]:
    "Happy birthday to someone who's aging like a fine wine and getting better with time (and hopefully not turning into vinegar)! Remember, age is just a number - unless you're a bottle of wine, in which case, it's a very important number. May the years ahead be as wonderful as you are!",
  [Category.THANK_YOU]: "Thank you",
  [Category.TESTIMONY]: "Testimony",
  [Category.ANNIVERSARY]: "Anniversary",
  [Category.BABY_SHOWER]: "Baby Shower",
  //   [Category.WeddingAndEngagement]: "Wedding and engagement",
  [Category.NEW_YEAR]: "New Year",
  [Category.VALENTINES]: "Valentines",
  [Category.MOTHERS_DAY]: "Mother's Day",
  [Category.FATHERS_DAY]: "Father's Day",
  [Category.GRADUATION]: "Graduation",
  //   [Category.Halloween]: "Halloween",
  [Category.THANKSGIVING]: "Thanksgiving",
  [Category.CHRISTMAS]: "Christmas",
};
