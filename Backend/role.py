from typing import List, Optional
from Backend.information import *

class Character:
    """
    The base class for all characters in the Blood on the Clocktower game.
    It holds static role information.

    Attributes:
        name: str
            The name of the character
        role_type: str
            The role type of the character.
            'TW' - Townsfolk
            'O' - Outsider
            'M' - Minion
            'D' - Demon
            'T' - Traveler
        ability_timing: str
            the timing an ability goes off
            'N1' - Night 1
            'N' - Night
            'N*' - Night*
            'D' - Day 
            'O' - One use
            'P' - Passive
        ability_description: str
            Almanac entry for the character
        setup: str
            Any setup alterations the character presents
    """
    def __init__(self, name: str,  role_type: str, ability_timing: str, ability_description: str, setup: str):
            self.name: str = name
            self.role_type: str = role_type
            self.ability_timing: str = ability_timing
            self.ability_description: str = ability_description
            self.setup: str = setup

    
class Player():
    """
    Dynamic player state in a game

    For any list:
            list[0] = Night 1
            list[1] = Day 1
            list[2] = Night 2
            etc.

    Args:
        player: str
            The name of the player
        alignment: str
            The alignment of the player
        role: Character
            The character of the player
        hidden_role Character
            The true character of the player (in case of drunk, Marionette, etc)
            If the character is not obscured, hidden_role = role
        is_alive: bool
            The living state of the player
        death_cause: str
            THe suspected reason for a person's death
        is_droisoned:
            Whether or not a player is droisoned on a given day
        tokens: List[List[str]]
            The tokens placed in the grim on each player
        info: List[str]
            The information given from each player
        notes: str
            Any specific note you have on a player
    """
    def __init__(self, player:str, alignment: str, character: Character):
        self.player: str = player
        self.alignment: str = alignment 
        self.role: Character = character
        self.hidden_role: Character = character
        self.is_alive: List[bool] = []
        self.death_cause: str = ""
        self.is_droisoned: List[bool] = []
        self.tokens: List[List[str]] = [] 
        self.info: List[Information] = []
        self.notes: str = ""
    


