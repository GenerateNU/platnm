package models

type SectionItem struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	CoverPhoto string `json:"cover_photo"`
}

type SectionType struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	SearchType string `json:"search_type"`
}

type SectionTypeItem struct {
	UserID        string `json:"user_id"`
	SectionItemId string `json:"section_item_id"`
	SectionTypeId string `json:"section_type_id"`
}
