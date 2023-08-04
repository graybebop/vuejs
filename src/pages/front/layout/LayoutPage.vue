<template>
  <!--begin::gb-app-->
  <div class="d-flex flex-column flex-root gb-app-root">
    <!--begin::Page-->
    <div class="gb-app-page">
      <!--begin::Header-->
      <div class="gb-app-header">
        <div class="gb-app-container">
          <div class="d-flex flex-row">
            <div class="gb-app-header-menu">메뉴(gnb)</div>
            <div class="gb-app-header-navbar">nav-bar(login)</div>
          </div>
        </div>
      </div>
      <!--end::Header-->
      <!--begin::Wrapper-->
      <div class="gb-app-wrapper">
        <!--begin::Sidebar-->
        <div class="gb-app-sidebar d-flex flex-column">
          <div class="gb-app-sidebar-logo text-center">사이드바 로고</div>
          <div class="gb-app-sidebar-menu">사이드 메뉴</div>
          <div class="gb-app-sidebar-footer text-center">사이드바 푸터</div>
        </div>
        <!--end::Sidebar-->
        <!--begin::Main-->
        <div class="gb-app-main flex-column flex-row-fluid">
          <div class="gb-app-content">
            <div class="gb-app-container">
              <router-view></router-view>
            </div>
          </div>
          <div class="gb-app-footer">
            <div class="gb-app-container">푸터</div>
          </div>
        </div>
        <!--begin::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
  <!--end::gb-app-->
</template>

<style lang="scss">
body {
  display: flex;
  flex-direction: column;
}
.d-flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}
.flex-column {
  flex-direction: column;
}

.flex-root {
  flex: 1;
}

.flex-column-fluid {
  flex: 1 0 auto;
}
.flex-row-fluid {
  flex: 1 auto;
  min-width: 0;
}

$prefix: 'gb-app';
.#{$prefix}-root {
  width: 100%;
  height: 100vh;
}
.#{$prefix}-page {
  display: flex;
  flex-direction: column;
}

.#{$prefix}-container {
  padding-left: 30px !important;
  padding-right: 30px !important;
}

.#{$prefix}-sidebar {
  position: fixed;
  z-index: 105;
  top: 0;
  bottom: 0;
  left: 0;

  display: flex;
  flex-shrink: 0;
  width: 0;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.#{$prefix}-main {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  .#{$prefix}-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #000;
  }
}

.#{$prefix}-page {
  height: 100%;
}
.#{$prefix}-wrapper {
  width: 100%;
  height: 100%;
  margin-left: 0;
}
.#{$prefix}-sidebar {
  background-color: #000;
  color: #fff;
}
.#{$prefix}-sidebar-logo {
  width: 100%;
}

.#{$prefix}-sidebar-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.#{$prefix}-header {
  width: 100%;
  margin-left: 0;
}
</style>
